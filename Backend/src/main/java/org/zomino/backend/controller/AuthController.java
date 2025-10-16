package org.zomino.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zomino.backend.dto.AuthResponse;
import org.zomino.backend.dto.LoginRequest;
import org.zomino.backend.dto.RegisterRequest;
import org.zomino.backend.dto.UserDTO;
import org.zomino.backend.model.User;
import org.zomino.backend.service.AuthService;
import org.zomino.backend.service.SecurityService;
import org.zomino.backend.service.TokenService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;
    private final SecurityService securityService;

    public AuthController(AuthService authService, TokenService tokenService, SecurityService securityService) {
        this.authService = authService;
        this.tokenService = tokenService;
        this.securityService = securityService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req, HttpServletResponse response) {
        try {
            UserDTO userDTO = authService.register(
                req.getName(),
                req.getEmail(),
                req.getPassword(),
                req.getRole(),
                req.getPhone(),
                req.getAddress()
            );
            // create token and set cookie
            String token = tokenService.createTokenForUser(userDTO.getId());
            Cookie cookie = new Cookie("ZOMINO_TOKEN", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 3600); // 7 days
            response.addCookie(cookie);

            AuthResponse resp = new AuthResponse("Registration successful", userDTO);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        try {
            UserDTO userDTO = authService.login(req.getEmail(), req.getPassword());
            // create token and set cookie
            String token = tokenService.createTokenForUser(userDTO.getId());
            Cookie cookie = new Cookie("ZOMINO_TOKEN", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 3600);
            response.addCookie(cookie);

            AuthResponse resp = new AuthResponse("Login successful", userDTO);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(value = "ZOMINO_TOKEN", required = false) String token, HttpServletResponse response) {
        if (token != null) tokenService.revokeToken(token);
        Cookie cookie = new Cookie("ZOMINO_TOKEN", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().body(new AuthResponse("Logged out", null));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Optional<User> u = securityService.getUserFromRequest(request);
        if (u.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Not authenticated", null));
        return ResponseEntity.ok(new AuthResponse("OK", new UserDTO(u.get())));
    }
}
