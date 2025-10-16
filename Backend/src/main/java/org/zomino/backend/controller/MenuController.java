package org.zomino.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zomino.backend.dto.MenuItemDTO;
import org.zomino.backend.dto.MenuItemRequest;
import org.zomino.backend.model.MenuItem;
import org.zomino.backend.model.Restaurant;
import org.zomino.backend.repository.MenuItemRepository;
import org.zomino.backend.repository.RestaurantRepository;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
public class MenuController {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuController(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> getMenu(@PathVariable("restaurantId") Long restaurantId) {
        Optional<Restaurant> or = restaurantRepository.findById(restaurantId);
        if (or.isEmpty()) return ResponseEntity.notFound().build();
        List<MenuItem> menu = or.get().getMenu();
        List<MenuItemDTO> dto = menu.stream().map(MenuItemDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<MenuItemDTO> addMenuItem(@PathVariable("restaurantId") Long restaurantId, @Valid @RequestBody MenuItemRequest req) {
        Optional<Restaurant> or = restaurantRepository.findById(restaurantId);
        if (or.isEmpty()) return ResponseEntity.notFound().build();
        Restaurant r = or.get();
        MenuItem item = new MenuItem(req.getName(), req.getType(), req.getPrice());
        r.addMenuItem(item);
        restaurantRepository.save(r);
        return ResponseEntity.ok(new MenuItemDTO(item));
    }
}
