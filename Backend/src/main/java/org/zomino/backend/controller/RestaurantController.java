package org.zomino.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zomino.backend.dto.RestaurantDTO;
import org.zomino.backend.model.Restaurant;
import org.zomino.backend.repository.RestaurantRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping
    public List<RestaurantDTO> listAll() {
        List<Restaurant> list = restaurantRepository.findAll();
        return list.stream().map(RestaurantDTO::new).collect(Collectors.toList());
    }
}
