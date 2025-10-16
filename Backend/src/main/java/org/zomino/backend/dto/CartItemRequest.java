package org.zomino.backend.dto;

import java.math.BigDecimal;

public class CartItemRequest {
    private Long userId;
    private Long menuItemId;
    private Integer quantity;

    public CartItemRequest() {}

    public CartItemRequest(Long userId, Long menuItemId, Integer quantity) {
        this.userId = userId;
        this.menuItemId = menuItemId;
        this.quantity = quantity;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

