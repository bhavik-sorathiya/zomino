package org.zomino.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zomino.backend.dto.OrderDTO;
import org.zomino.backend.dto.OrderItemRequest;
import org.zomino.backend.dto.OrderRequest;
import org.zomino.backend.model.*;
import org.zomino.backend.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository,
                        CartService cartService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderDTO placeOrder(OrderRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found. Please login to place order."));

        // Validate items present
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        // Infer restaurant id from first menu item if not provided
        Long targetRestaurantId = request.getRestaurantId();
        if (targetRestaurantId == null) {
            Long firstMenuItemId = request.getItems().get(0).getMenuItemId();
            MenuItem firstMenuItem = menuItemRepository.findById(firstMenuItemId)
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + firstMenuItemId));
            if (firstMenuItem.getRestaurant() == null) throw new RuntimeException("Menu item is not associated with a restaurant");
            targetRestaurantId = firstMenuItem.getRestaurant().getId();
        }

        Restaurant restaurant = restaurantRepository.findById(targetRestaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Ensure all items belong to the same restaurant
        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemRequest.getMenuItemId()));
            if (menuItem.getRestaurant() == null || !menuItem.getRestaurant().getId().equals(targetRestaurantId)) {
                throw new RuntimeException("All items must belong to the same restaurant");
            }
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.getDeliveryAddress() != null ?
                request.getDeliveryAddress() : user.getAddress());
        order.setStatus("PENDING");

        // Add order items and calculate total
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemRequest.getMenuItemId()));

            OrderItem orderItem = new OrderItem(menuItem, itemRequest.getQuantity(), menuItem.getPrice());
            order.addItem(orderItem);

            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);
        }

        // Server-side fixed delivery charge and tax calculation
        final BigDecimal DELIVERY_CHARGE = BigDecimal.valueOf(50);
        final BigDecimal TAX_RATE = BigDecimal.valueOf(0.05); // 5%
        BigDecimal tax = totalPrice.multiply(TAX_RATE);
        BigDecimal grandTotal = totalPrice.add(tax).add(DELIVERY_CHARGE);

        order.setTotalPrice(totalPrice);
        order.setDeliveryCharge(DELIVERY_CHARGE);
        order.setGrandTotal(grandTotal);
        order = orderRepository.save(order);

        // Clear user's cart after successful order
        try {
            cartService.clearCart(user.getId());
        } catch (Exception e) {
            // Cart clearing is not critical, continue
        }

        return new OrderDTO(order);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return new OrderDTO(order);
    }

    public List<OrderDTO> getRestaurantOrders(Long restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        return orders.stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        return new OrderDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
    }
}
