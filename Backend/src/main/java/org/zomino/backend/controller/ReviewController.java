package org.zomino.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zomino.backend.dto.ReviewDTO;
import org.zomino.backend.dto.ReviewRequest;
import org.zomino.backend.service.ReviewService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
// CORS configured globally in WebConfig (allowedOriginPatterns + allowCredentials(true))
// Remove controller-level @CrossOrigin to avoid wildcard origin with credentials
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        try {
            ReviewDTO review = reviewService.addReview(request);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ReviewDTO>> getRestaurantReviews(@PathVariable Long restaurantId) {
        List<ReviewDTO> reviews = reviewService.getRestaurantReviews(restaurantId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getUserReviews(@PathVariable Long userId) {
        List<ReviewDTO> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
