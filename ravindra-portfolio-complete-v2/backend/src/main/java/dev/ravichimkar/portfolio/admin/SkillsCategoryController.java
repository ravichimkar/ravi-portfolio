package dev.ravichimkar.portfolio.admin;

import dev.ravichimkar.portfolio.api.ApiResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/admin/skills")
@PreAuthorize("hasRole('ADMIN')")
public class SkillsCategoryController {
    private final JdbcTemplate jdbc;

    public SkillsCategoryController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @GetMapping
    public ApiResponse<?> list() {
        var rows = jdbc.queryForList(
            "SELECT category, MAX(description) description, MAX(published) published, MIN(display_order) display_order " +
            "FROM skills GROUP BY category ORDER BY MIN(display_order), category"
        );
        List<Map<String,Object>> out = new ArrayList<>();
        for (var row : rows) {
            String category = String.valueOf(row.get("category"));
            var skills = jdbc.queryForList(
                "SELECT name FROM skills WHERE category=? ORDER BY display_order,id", category
            ).stream().map(x -> Map.of("name", x.get("name"))).toList();
            Map<String,Object> item = new LinkedHashMap<>();
            item.put("id", idFor(category));
            item.put("label", category);
            item.put("description", row.get("description") == null ? "" : row.get("description"));
            item.put("skills", skills);
            item.put("published", Boolean.TRUE.equals(row.get("published")));
            item.put("displayOrder", row.get("display_order"));
            out.add(item);
        }
        return ApiResponse.ok(out);
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String,Object> body, Authentication auth) {
        String category = String.valueOf(body.getOrDefault("label", "")).trim();
        if (category.isEmpty()) return ApiResponse.error("Category is required");
        saveCategory(category, body, null);
        return ApiResponse.ok(find(category));
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable String id, @RequestBody Map<String,Object> body, Authentication auth) {
        String oldCategory = decodeId(id);
        String category = String.valueOf(body.getOrDefault("label", oldCategory)).trim();
        if (category.isEmpty()) return ApiResponse.error("Category is required");
        jdbc.update("DELETE FROM skills WHERE category=?", oldCategory);
        saveCategory(category, body, null);
        return ApiResponse.ok(find(category));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        String category = decodeId(id);
        jdbc.update("DELETE FROM skills WHERE category=?", category);
        return ApiResponse.ok(null);
    }

    private void saveCategory(String category, Map<String,Object> body, Object ignored) {
        boolean published = !Boolean.FALSE.equals(body.get("published"));
        int order = body.get("displayOrder") == null ? 0 : Integer.parseInt(String.valueOf(body.get("displayOrder")));
        String description = String.valueOf(body.getOrDefault("description", ""));
        Object raw = body.get("skills");
        List<String> names = new ArrayList<>();
        if (raw instanceof List<?> list) {
            for (Object x : list) {
                if (x instanceof Map<?,?> m) names.add(String.valueOf(m.get("name")));
                else names.add(String.valueOf(x));
            }
        }
        for (int i=0; i<names.size(); i++) {
            String name = names.get(i).trim();
            if (!name.isEmpty()) {
                jdbc.update(
                    "INSERT INTO skills(category,name,description,display_order,published) VALUES(?,?,?,?,?)",
                    category, name, description, order + i, published
                );
            }
        }
    }

    private Map<String,Object> find(String category) {
        var row = jdbc.queryForMap(
            "SELECT category, MAX(description) description, MAX(published) published, MIN(display_order) display_order FROM skills WHERE category=? GROUP BY category",
            category
        );
        var skills = jdbc.queryForList("SELECT name FROM skills WHERE category=? ORDER BY display_order,id", category)
            .stream().map(x -> Map.of("name", x.get("name"))).toList();
        Map<String,Object> item = new LinkedHashMap<>();
        item.put("id", idFor(category));
        item.put("label", category);
        item.put("description", row.get("description"));
        item.put("skills", skills);
        item.put("published", row.get("published"));
        item.put("displayOrder", row.get("display_order"));
        return item;
    }

    private String idFor(String category) {
        return "cat-" + Base64.getUrlEncoder().withoutPadding().encodeToString(category.getBytes(StandardCharsets.UTF_8));
    }

    private String decodeId(String id) {
        String raw = id.startsWith("cat-") ? id.substring(4) : id;
        return new String(Base64.getUrlDecoder().decode(raw), StandardCharsets.UTF_8);
    }
}
