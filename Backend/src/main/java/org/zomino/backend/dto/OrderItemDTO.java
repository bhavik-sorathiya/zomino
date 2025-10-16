package org.zomino.backend.dto;

import org.zomino.backend.model.OrderItem;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal price;

    public OrderItemDTO() {}

    public OrderItemDTO(OrderItem orderItem) {
        this.id = orderItem.getId();
        this.menuItemId = orderItem.getMenuItem().getId();
        this.menuItemName = orderItem.getMenuItem().getName();
        this.quantity = orderItem.getQuantity();
        this.price = orderItem.getPrice();
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

