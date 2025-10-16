package org.zomino.backend.service;

import org.springframework.stereotype.Service;
import org.zomino.backend.model.Restaurant;
import org.zomino.backend.model.MenuItem;
import org.zomino.backend.repository.RestaurantRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public List<Restaurant> findAll() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> findById(Long id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant save(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public MenuItem addMenuItem(Long restaurantId, MenuItem item) {
        Optional<Restaurant> or = restaurantRepository.findById(restaurantId);
        if (or.isEmpty()) throw new IllegalArgumentException("Restaurant not found: " + restaurantId);
        Restaurant r = or.get();
        r.addMenuItem(item);
        restaurantRepository.save(r);
        return item;
    }
}

