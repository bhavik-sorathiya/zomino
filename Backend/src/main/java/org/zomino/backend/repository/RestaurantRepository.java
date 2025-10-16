package org.zomino.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zomino.backend.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
