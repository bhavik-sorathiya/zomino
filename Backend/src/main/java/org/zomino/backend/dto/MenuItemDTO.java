package org.zomino.backend.dto;

import org.zomino.backend.model.MenuItem;

import java.math.BigDecimal;

public class MenuItemDTO {
    private Long id;
    private String name;
    private String type;
    private BigDecimal price;

    public MenuItemDTO() {}

    public MenuItemDTO(MenuItem item) {
        this.id = item.getId();
        this.name = item.getName();
        this.type = item.getType();
        this.price = item.getPrice();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

