package org.zomino.backend.dto;

import org.zomino.backend.model.CartItem;

import java.math.BigDecimal;

public class CartItemDTO {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private Long restaurantId; // NEW

    public CartItemDTO() {}

    public CartItemDTO(CartItem cartItem) {
        this.id = cartItem.getId();
        this.menuItemId = cartItem.getMenuItem().getId();
        this.menuItemName = cartItem.getMenuItem().getName();
        this.price = cartItem.getMenuItem().getPrice();
        this.quantity = cartItem.getQuantity();
        this.subtotal = this.price.multiply(BigDecimal.valueOf(this.quantity));
        // set restaurant id if available
        if (cartItem.getMenuItem().getRestaurant() != null) {
            this.restaurantId = cartItem.getMenuItem().getRestaurant().getId();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
}
