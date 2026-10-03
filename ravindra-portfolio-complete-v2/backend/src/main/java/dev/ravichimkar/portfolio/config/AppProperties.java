package dev.ravichimkar.portfolio.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
@ConfigurationProperties(prefix="app")
public record AppProperties(Jwt jwt,String corsOrigins){ public record Jwt(String secret,long expirationMinutes){} }
