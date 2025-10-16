package org.zomino.backend.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Long> tokenToUser = new ConcurrentHashMap<>();

    public String createTokenForUser(Long userId) {
        byte[] b = new byte[24];
        random.nextBytes(b);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(b);
        tokenToUser.put(token, userId);
        return token;
    }

    public Long getUserIdForToken(String token) {
        if (token == null) return null;
        return tokenToUser.get(token);
    }

    public void revokeToken(String token) {
        if (token == null) return;
        tokenToUser.remove(token);
    }
}
