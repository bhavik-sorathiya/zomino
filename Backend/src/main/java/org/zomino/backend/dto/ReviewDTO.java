package org.zomino.backend.dto;

import org.zomino.backend.model.Review;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long restaurantId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDTO() {}

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.userId = review.getUser().getId();
        this.userName = review.getUser().getName();
        this.restaurantId = review.getRestaurant().getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
