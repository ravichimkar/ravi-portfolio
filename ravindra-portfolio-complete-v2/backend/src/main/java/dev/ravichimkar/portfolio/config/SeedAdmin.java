package dev.ravichimkar.portfolio.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedAdmin {

    @Bean
    CommandLineRunner seed(
            JdbcTemplate jdbc,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            String email = System.getenv().getOrDefault(
                    "ADMIN_EMAIL",
                    "admin@ravindrachimkar.dev"
            );

            String password = System.getenv().get("ADMIN_PASSWORD");

            if (password == null || password.isBlank()) {
                System.out.println(
                        "ADMIN_PASSWORD is not set. Skipping admin seed."
                );
                return;
            }

            Integer count = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE email = ?",
                    Integer.class,
                    email
            );

            if (count != null && count == 0) {
                jdbc.update(
                        """
                        INSERT INTO users(
                            email,
                            password_hash,
                            full_name,
                            enabled
                        )
                        VALUES (?, ?, ?, TRUE)
                        """,
                        email,
                        passwordEncoder.encode(password),
                        "Ravindra Chimkar Admin"
                );

                Long userId = jdbc.queryForObject(
                        "SELECT id FROM users WHERE email = ?",
                        Long.class,
                        email
                );

                Long roleId = jdbc.queryForObject(
                        "SELECT id FROM roles WHERE name = 'ADMIN'",
                        Long.class
                );

                jdbc.update(
                        "INSERT INTO user_roles(user_id, role_id) VALUES (?, ?)",
                        userId,
                        roleId
                );

                System.out.println(
                        "Admin user seeded successfully: " + email
                );
            }
        };
    }
}
