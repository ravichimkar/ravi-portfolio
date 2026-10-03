package dev.ravichimkar.portfolio.auth;

import dev.ravichimkar.portfolio.api.ApiResponse;
import dev.ravichimkar.portfolio.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JdbcTemplate j;
    private final PasswordEncoder e;
    private final JwtService jwt;

    public AuthController(JdbcTemplate j, PasswordEncoder e, JwtService jwt) {
        this.j = j; this.e = e; this.jwt = jwt;
    }

    public record Login(@Email @NotBlank String email, @NotBlank String password) {}

    @PostMapping("/login")
    public ApiResponse<?> login(@Valid @RequestBody Login r) {
        var u = j.query(
            "SELECT id,password_hash,full_name,enabled FROM users WHERE email=?",
            (x,n) -> Map.of("id",x.getLong(1),"hash",x.getString(2),"name",x.getString(3),"enabled",x.getBoolean(4)),
            r.email()
        );
        if (u.isEmpty() || !(boolean)u.getFirst().get("enabled") ||
            !e.matches(r.password(), (String)u.getFirst().get("hash"))) {
            return ApiResponse.error("Invalid email or password");
        }

        Long userId = (Long)u.getFirst().get("id");
        List<String> roles = j.query(
            "SELECT r.name FROM roles r JOIN user_roles ur ON r.id=ur.role_id WHERE ur.user_id=?",
            (x,n) -> x.getString(1), userId
        );

        String token = jwt.generate(r.email(), roles);
        try {
            j.update(
                "INSERT INTO activity_logs(actor_email,action,entity_type,entity_id,details) VALUES(?,?,?,?,?)",
                r.email(), "SIGNED_IN", "Auth", userId, ""
            );
        } catch (Exception ignored) {}

        return ApiResponse.ok(Map.of(
            "accessToken", token,
            "expiresIn", 7200,
            "tokenType", "Bearer",
            "user", Map.of(
                "id", String.valueOf(userId),
                "email", r.email(),
                "name", u.getFirst().get("name"),
                "roles", roles
            )
        ));
    }

    @GetMapping("/me")
    public ApiResponse<?> me(org.springframework.security.core.Authentication a) {
        return ApiResponse.ok(Map.of(
            "email", a.getName(),
            "roles", a.getAuthorities().stream().map(x -> x.getAuthority().replace("ROLE_","")).toList()
        ));
    }
}
