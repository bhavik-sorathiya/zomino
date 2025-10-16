package org.zomino.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zomino.backend.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}

