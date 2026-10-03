package dev.ravichimkar.portfolio.admin;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.ravichimkar.portfolio.api.ApiResponse;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final JdbcTemplate jdbc;

    private static final Map<String, String> TABLES = Map.of(
        "projects", "projects",
        "skills", "skills",
        "experience", "experiences",
        "education", "education",
        "certifications", "certifications",
        "achievements", "achievements",
        "social-links", "social_links"
    );

    public AdminController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/dashboard")
    public ApiResponse<?> dashboard() {
        Map<String, Object> result = new LinkedHashMap<>();

        long projects = count("SELECT COUNT(*) FROM projects");
        long published = count("SELECT COUNT(*) FROM projects WHERE status='PUBLISHED'");
        long skills = count("SELECT COUNT(*) FROM skills");
        long certifications = count("SELECT COUNT(*) FROM certifications");
        long unread = count("SELECT COUNT(*) FROM contact_messages WHERE is_read=FALSE");

        Map<String, Object> profile = jdbc.queryForMap("SELECT name,professional_title,location,email,summary,hero_description,profile_image_url,resume_url FROM profile LIMIT 1");
        int filled = 0;
        int total = profile.size();
        for (Object value : profile.values()) {
            if (value != null && !value.toString().trim().isEmpty()) filled++;
        }

        result.put("totalProjects", projects);
        result.put("publishedProjects", published);
        result.put("skills", skills);
        result.put("certifications", certifications);
        result.put("unreadMessages", unread);
        result.put("profileCompletion", total == 0 ? 0 : Math.round((filled * 100f) / total));
        result.put("experience", count("SELECT COUNT(*) FROM experiences"));
        result.put("education", count("SELECT COUNT(*) FROM education"));
        result.put("achievements", count("SELECT COUNT(*) FROM achievements"));
        result.put("recentActivity", jdbc.queryForList(
            "SELECT id, action, entity_type, actor_email, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 20"
        ));

        return ApiResponse.ok(result);
    }

    private long count(String sql) {
        Long value = jdbc.queryForObject(sql, Long.class);
        return value == null ? 0 : value;
    }

    @GetMapping("/profile")
    public ApiResponse<?> profile() {
        return ApiResponse.ok(
            jdbc.queryForMap("SELECT * FROM profile LIMIT 1")
        );
    }

    @PutMapping("/profile")
    public ApiResponse<?> updateProfile(
            @RequestBody Map<String, Object> body,
            Authentication auth
    ) {
        var allowed = List.of(
            "name",
            "professional_title",
            "location",
            "email",
            "summary",
            "hero_headline",
            "hero_description",
            "availability",
            "profile_image_url",
            "resume_url"
        );

        List<String> cols = allowed.stream()
            .filter(body::containsKey)
            .toList();

        if (cols.isEmpty()) {
            return ApiResponse.error("No editable fields supplied");
        }

        String sql =
            "UPDATE profile SET " +
            String.join(
                ", ",
                cols.stream()
                    .map(c -> c + "=?")
                    .toList()
            ) +
            " WHERE id=(SELECT id FROM (SELECT id FROM profile LIMIT 1) x)";

        jdbc.update(
            sql,
            cols.stream()
                .map(body::get)
                .toArray()
        );

        log(
            auth,
            "PROFILE_UPDATED",
            "profile",
            null,
            cols.toString()
        );

        return ApiResponse.ok(
            jdbc.queryForMap("SELECT * FROM profile LIMIT 1")
        );
    }

    @GetMapping("/content/{type}")
    public ApiResponse<?> list(@PathVariable String type) {
        String table = table(type);

        return ApiResponse.ok(
            jdbc.queryForList(
                "SELECT * FROM " +
                table +
                orderClause(type)
            )
        );
    }

    @PostMapping("/content/{type}")
    public ApiResponse<?> create(
            @PathVariable String type,
            @RequestBody Map<String, Object> body,
            Authentication auth
    ) {
        String table = table(type);

        Map<String, Object> clean =
            clean(type, body, false);

        if (clean.isEmpty()) {
            return ApiResponse.error(
                "No valid fields supplied"
            );
        }

        String cols =
            String.join(",", clean.keySet());

        String placeholders =
            String.join(
                ",",
                Collections.nCopies(
                    clean.size(),
                    "?"
                )
            );

        jdbc.update(
            "INSERT INTO " +
            table +
            "(" +
            cols +
            ") VALUES (" +
            placeholders +
            ")",
            clean.values().toArray()
        );

        log(
            auth,
            "CREATED",
            type,
            null,
            clean.keySet().toString()
        );

        return ApiResponse.ok(
            Map.of(
                "message",
                "Created successfully"
            )
        );
    }

    @PutMapping("/content/{type}/{id}")
    public ApiResponse<?> update(
            @PathVariable String type,
            @PathVariable long id,
            @RequestBody Map<String, Object> body,
            Authentication auth
    ) {
        String table = table(type);

        Map<String, Object> clean =
            clean(type, body, true);

        clean.remove("id");

        if (clean.isEmpty()) {
            return ApiResponse.error(
                "No valid fields supplied"
            );
        }

        String set =
            String.join(
                ",",
                clean.keySet()
                    .stream()
                    .map(k -> k + "=?")
                    .toList()
            );

        Object[] args =
            new Object[clean.size() + 1];

        int i = 0;

        for (Object value : clean.values()) {
            args[i++] = value;
        }

        args[i] = id;

        int updated =
            jdbc.update(
                "UPDATE " +
                table +
                " SET " +
                set +
                " WHERE id=?",
                args
            );

        if (updated == 0) {
            return ApiResponse.error(
                "Record not found"
            );
        }

        log(
            auth,
            "UPDATED",
            type,
            id,
            clean.keySet().toString()
        );

        return ApiResponse.ok(
            Map.of(
                "message",
                "Updated successfully"
            )
        );
    }

    @DeleteMapping("/content/{type}/{id}")
    public ApiResponse<?> delete(
            @PathVariable String type,
            @PathVariable long id,
            Authentication auth
    ) {
        String table = table(type);

        int deleted =
            jdbc.update(
                "DELETE FROM " +
                table +
                " WHERE id=?",
                id
            );

        if (deleted == 0) {
            return ApiResponse.error(
                "Record not found"
            );
        }

        log(
            auth,
            "DELETED",
            type,
            id,
            ""
        );

        return ApiResponse.ok(
            Map.of(
                "message",
                "Deleted successfully"
            )
        );
    }

    @GetMapping("/contact-messages")
    public ApiResponse<?> messages() {
        return ApiResponse.ok(
            jdbc.queryForList(
                "SELECT * FROM contact_messages " +
                "ORDER BY created_at DESC"
            )
        );
    }

    @PatchMapping("/contact-messages/{id}/read")
    public ApiResponse<?> read(
            @PathVariable long id,
            Authentication auth
    ) {
        jdbc.update(
            "UPDATE contact_messages " +
            "SET is_read=TRUE WHERE id=?",
            id
        );

        log(
            auth,
            "MESSAGE_READ",
            "contact_messages",
            id,
            ""
        );

        return ApiResponse.ok(
            Map.of(
                "message",
                "Message marked as read"
            )
        );
    }

    @DeleteMapping("/contact-messages/{id}")
    public ApiResponse<?> deleteMessage(
            @PathVariable long id,
            Authentication auth
    ) {
        jdbc.update(
            "DELETE FROM contact_messages " +
            "WHERE id=?",
            id
        );

        log(
            auth,
            "MESSAGE_DELETED",
            "contact_messages",
            id,
            ""
        );

        return ApiResponse.ok(
            Map.of(
                "message",
                "Message deleted"
            )
        );
    }

    @GetMapping("/operations/health")
    public ApiResponse<?> health() {
        long start = System.nanoTime();

        Integer value =
            jdbc.queryForObject(
                "SELECT 1",
                Integer.class
            );

        return ApiResponse.ok(
            Map.of(
                "api",
                "UP",

                "database",
                value != null && value == 1
                    ? "UP"
                    : "DOWN",

                "responseTimeMs",
                (System.nanoTime() - start) / 1_000_000,

                "environment",
                System.getProperty(
                    "spring.profiles.active",
                    "default"
                )
            )
        );
    }

    @GetMapping("/activity")
    public ApiResponse<?> activity() {
        return ApiResponse.ok(
            jdbc.queryForList(
                "SELECT * FROM activity_logs " +
                "ORDER BY created_at DESC " +
                "LIMIT 200"
            )
        );
    }

    @GetMapping("/settings")
    public ApiResponse<?> settings() {
        return ApiResponse.ok(
            jdbc.queryForList(
                "SELECT setting_key,setting_value,updated_at " +
                "FROM site_settings " +
                "ORDER BY setting_key"
            )
        );
    }

    @PutMapping("/settings/{key}")
    public ApiResponse<?> setting(
            @PathVariable String key,
            @RequestBody Map<String, Object> body,
            Authentication auth
    ) {
        Object value = body.get("value");

        jdbc.update(
            "INSERT INTO site_settings(" +
            "setting_key,setting_value" +
            ") VALUES(?,?) " +
            "ON DUPLICATE KEY UPDATE " +
            "setting_value=?",
            key,
            value,
            value
        );

        log(
            auth,
            "SETTING_UPDATED",
            "site_settings",
            null,
            key
        );

        return ApiResponse.ok(
            Map.of(
                "key",
                key,
                "value",
                value
            )
        );
    }

    private String table(String type) {
        String table = TABLES.get(type);

        if (table == null) {
            throw new IllegalArgumentException(
                "Unsupported content type"
            );
        }

        return table;
    }

    private String orderClause(String type) {
        return switch (type) {
            case "projects",
                 "skills",
                 "experience",
                 "education",
                 "certifications",
                 "achievements",
                 "social-links" ->
                    " ORDER BY display_order,id";

            default ->
                    " ORDER BY id";
        };
    }

    private Map<String, Object> clean(
            String type,
            Map<String, Object> body,
            boolean update
    ) {
        Set<String> allowed = switch (type) {

            case "projects" ->
                Set.of(
                    "title",
                    "slug",
                    "short_description",
                    "description",
                    "architecture",
                    "technical_implementation",
                    "challenges",
                    "github_url",
                    "live_demo_url",
                    "thumbnail_url",
                    "featured",
                    "status",
                    "display_order"
                );

            // FIXED TO MATCH THE ACTUAL DATABASE
            case "skills" ->
                Set.of(
                    "category",
                    "name",
                    "description",
                    "display_order",
                    "published"
                );

            case "experience" ->
                Set.of(
                    "company",
                    "role",
                    "location",
                    "start_date",
                    "end_date",
                    "description",
                    "published",
                    "display_order"
                );

            case "education" ->
                Set.of(
                    "institution",
                    "degree",
                    "field_of_study",
                    "start_year",
                    "end_year",
                    "cgpa",
                    "description",
                    "published",
                    "display_order"
                );

            case "certifications" ->
                Set.of(
                    "name",
                    "issuer",
                    "completion_date",
                    "credential_url",
                    "description",
                    "image_url",
                    "published",
                    "display_order"
                );

            case "achievements" ->
                Set.of(
                    "title",
                    "description",
                    "achievement_date",
                    "url",
                    "image_url",
                    "published",
                    "display_order"
                );

            case "social-links" ->
                Set.of(
                    "platform",
                    "url",
                    "icon",
                    "display_order",
                    "active"
                );

            default ->
                Set.of();
        };

        Map<String, Object> out =
            new LinkedHashMap<>();

        for (String key : allowed) {
            if (body.containsKey(key)) {
                out.put(
                    key,
                    body.get(key)
                );
            }
        }

        return out;
    }

    private void log(
            Authentication auth,
            String action,
            String entity,
            Long id,
            String details
    ) {
        try {
            jdbc.update(
                "INSERT INTO activity_logs(" +
                "actor_email," +
                "action," +
                "entity_type," +
                "entity_id," +
                "details" +
                ") VALUES(?,?,?,?,?)",

                auth == null
                    ? null
                    : auth.getName(),

                action,
                entity,
                id,
                details
            );

        } catch (Exception ignored) {
        }
    }
}