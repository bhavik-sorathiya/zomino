package org.zomino.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.zomino.backend.dto.UserDTO;
import org.zomino.backend.model.Cart;
import org.zomino.backend.model.User;
import org.zomino.backend.repository.CartRepository;
import org.zomino.backend.repository.UserRepository;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    public UserDTO register(String name, String email, String rawPassword, String role, String phone, String address) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        String hashed = passwordEncoder.encode(rawPassword);
        User user = new User(name, email, hashed, role != null ? role : "USER");
        user.setPhone(phone);
        user.setAddress(address);
        user = userRepository.save(user);

        // Create cart for user
        Cart cart = new Cart(user);
        cartRepository.save(cart);

        return new UserDTO(user);
    }

    public UserDTO login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new UserDTO(user);
    }

    public boolean checkPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
