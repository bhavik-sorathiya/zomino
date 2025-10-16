package org.zomino.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zomino.backend.model.User;
import org.zomino.backend.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class SecurityService {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    @Autowired
    public SecurityService(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    public Optional<User> getUserFromRequest(HttpServletRequest req) {
        if (req == null) return Optional.empty();
        if (req.getCookies() == null) return Optional.empty();
        String token = null;
        for (Cookie c : req.getCookies()) {
            if (c.getName().equals("ZOMINO_TOKEN")) {
                token = c.getValue();
                break;
            }
        }
        if (token == null) return Optional.empty();
        Long userId = tokenService.getUserIdForToken(token);
        if (userId == null) return Optional.empty();
        return userRepository.findById(userId);
    }

    public User requireUser(HttpServletRequest req) {
        return getUserFromRequest(req).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required"));
    }

    public User requireRole(HttpServletRequest req, String... roles) {
        User u = requireUser(req);
        for (String r : roles) {
            if (r.equalsIgnoreCase(u.getRole())) return u;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: insufficient role");
    }
}

