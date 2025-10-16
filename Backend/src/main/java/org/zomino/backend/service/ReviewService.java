package org.zomino.backend.service;

import org.springframework.stereotype.Service;
import org.zomino.backend.dto.ReviewDTO;
import org.zomino.backend.dto.ReviewRequest;
import org.zomino.backend.model.Restaurant;
import org.zomino.backend.model.Review;
import org.zomino.backend.model.User;
import org.zomino.backend.repository.RestaurantRepository;
import org.zomino.backend.repository.ReviewRepository;
import org.zomino.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public ReviewDTO addReview(ReviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review(user, restaurant, request.getRating(), request.getComment());
        review = reviewRepository.save(review);

        return new ReviewDTO(review);
    }

    public List<ReviewDTO> getRestaurantReviews(Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        return reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        return reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        reviewRepository.delete(review);
    }
}
