package org.zomino.backend.dto;

import org.zomino.backend.model.Restaurant;

import java.util.List;
import java.util.stream.Collectors;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private List<MenuItemDTO> menu;
    private Long ownerId;
    private String ownerName;

    public RestaurantDTO() {}

    public RestaurantDTO(Restaurant r) {
        this.id = r.getId();
        this.name = r.getName();
        this.address = r.getAddress();
        this.menu = r.getMenu() == null ? List.of() : r.getMenu().stream().map(MenuItemDTO::new).collect(Collectors.toList());
        if (r.getOwner() != null) {
            this.ownerId = r.getOwner().getId();
            this.ownerName = r.getOwner().getName();
        }
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<MenuItemDTO> getMenu() {
        return menu;
    }

    public void setMenu(List<MenuItemDTO> menu) {
        this.menu = menu;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
}
