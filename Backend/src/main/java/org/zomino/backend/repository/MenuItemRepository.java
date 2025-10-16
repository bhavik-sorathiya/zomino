package org.zomino.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zomino.backend.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}

