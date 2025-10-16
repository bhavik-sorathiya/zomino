// Explanation: Add a REST controller that exposes cart-related endpoints and delegates to CartService.
// It implements: get cart items, add to cart, remove item, update quantity, clear cart, and get total.
package org.zomino.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zomino.backend.dto.CartItemDTO;
import org.zomino.backend.dto.CartItemRequest;
import org.zomino.backend.service.CartService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@PathVariable Long userId) {
        List<CartItemDTO> items = cartService.getCartItems(userId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        try {
            CartItemDTO dto = cartService.addToCart(request.getUserId(), request.getMenuItemId(), request.getQuantity());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId, @RequestParam Long userId) {
        try {
            cartService.removeFromCart(userId, cartItemId);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long cartItemId, @RequestBody CartItemRequest request) {
        try {
            cartService.updateCartItemQuantity(request.getUserId(), cartItemId, request.getQuantity());
            return ResponseEntity.ok(Map.of("message", "Quantity updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok(Map.of("message", "Cart cleared"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/total")
    public ResponseEntity<?> getCartTotal(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(Map.of("total", cartService.getCartTotal(userId)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

