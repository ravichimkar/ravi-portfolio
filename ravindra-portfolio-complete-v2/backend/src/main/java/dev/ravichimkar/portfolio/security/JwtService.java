package dev.ravichimkar.portfolio.security;
import dev.ravichimkar.portfolio.config.AppProperties;
import io.jsonwebtoken.Claims; import io.jsonwebtoken.Jwts; import io.jsonwebtoken.security.Keys; import org.springframework.stereotype.Service;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.time.Instant; import java.util.Date; import java.util.List;
@Service public class JwtService { private final AppProperties p; public JwtService(AppProperties p){this.p=p;} private SecretKey key(){return Keys.hmacShaKeyFor(p.jwt().secret().getBytes(StandardCharsets.UTF_8));} public String generate(String email,List<String> roles){Instant n=Instant.now();return Jwts.builder().subject(email).claim("roles",roles).issuedAt(Date.from(n)).expiration(Date.from(n.plusSeconds(p.jwt().expirationMinutes()*60))).signWith(key()).compact();} public Claims parse(String token){return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();} }
