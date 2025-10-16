package org.zomino.backend.dto;

public class AuthResponse {
    private String message;
    private UserDTO user;

    public AuthResponse() {}

    public AuthResponse(String message, UserDTO user) {
        this.message = message;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}

