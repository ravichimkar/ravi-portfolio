/**
 * Mock implementation of the REST contract (development only).
 *
 * Every handler mirrors an endpoint the Spring Boot backend will implement,
 * returning the same { data, message, success } envelope and HTTP status codes.
 */

import type {
  ActivityEntry,
  ApiEnvelope,
  AuthResponse,
  AuthUser,
  DashboardResponse,
  LoginRequest,
  MediaUploadResponse,
} from "../types";
import {
  db,
  logActivity,
  persistDb,
  newId,
  nextOrder,
  publishedOnly,
  slugify,
  sortByOrder,
} from "./db";

export interface MockEnvelope<T> extends ApiEnvelope<T> {
  status?: number;
}

interface MockContext {
  token: string | null;
  formData: FormData | null;
}

const LATENCY_MS = 260;
const SESSION_TTL_SECONDS = 60 * 30;

const ok = <T>(data: T, message: string | null = null): MockEnvelope<T> => ({
  data,
  message,
  success: true,
  status: 200,
});

const fail = <T>(status: number, message: string): MockEnvelope<T> => ({
  data: null,
  message,
  success: false,
  status,
});

/* --------------------------------- auth ---------------------------------- */

interface Session {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

const sessions = new Map<string, Session>();

const MOCK_ADMIN_EMAIL: string =
  import.meta.env["VITE_MOCK_ADMIN_EMAIL"] ?? db.profile.email;
const MOCK_ADMIN_PASSWORD: string | undefined = import.meta.env["VITE_MOCK_ADMIN_PASSWORD"];

function createSession(user: AuthUser): AuthResponse {
  const token = newId("mock-token");
  sessions.set(token, { token, user, expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 });
  return { accessToken: token, expiresIn: SESSION_TTL_SECONDS, tokenType: "Bearer", user };
}

function sessionFor(token: string | null): Session | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

/* ------------------------------- utilities -------------------------------- */

type Collection =
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "certifications"
  | "achievements"
  | "socialLinks";

const COLLECTION_BY_SEGMENT: Record<string, Collection> = {
  projects: "projects",
  skills: "skills",
  experience: "experience",
  education: "education",
  certifications: "certifications",
  achievements: "achievements",
  "social-links": "socialLinks",
};

const LABEL_BY_COLLECTION: Record<Collection, string> = {
  projects: "Project",
  skills: "Skill category",
  experience: "Experience",
  education: "Education",
  certifications: "Certification",
  achievements: "Achievement",
  socialLinks: "Social link",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function list(collection: Collection): AnyRecord[] {
  return db[collection] as unknown as AnyRecord[];
}

function profileCompletion() {
  const p = db.profile;
  const fields = [
    p.name,
    p.title,
    p.location,
    p.email,
    p.summary,
    p.heroHeadline,
    p.heroDescription,
    p.availabilityStatus,
    p.resumeUrl,
    p.photoUrl,
  ];
  const filled = fields.filter((value) => Boolean(value && String(value).trim())).length;
  return Math.round((filled / fields.length) * 100);
}

/* -------------------------------- dispatch -------------------------------- */

export async function mockDispatch<T>(
  method: string,
  rawPath: string,
  body: unknown,
  ctx: MockContext,
): Promise<MockEnvelope<T>> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  const path = rawPath.split("?")[0]!.replace(/\/$/, "");
  const segments = path.split("/").filter(Boolean); // ["api", ...]
  const result = route(method.toUpperCase(), segments, body, ctx);
  persistDb();
  return result as MockEnvelope<T>;
}

function requireAdmin(ctx: MockContext): Session | MockEnvelope<never> {
  const session = sessionFor(ctx.token);
  if (!session) return fail(401, "Your session has expired. Please sign in again.");
  if (!session.user.roles.includes("ADMIN")) {
    return fail(403, "You do not have permission to perform this action.");
  }
  return session;
}

function isEnvelope(value: unknown): value is MockEnvelope<never> {
  return typeof value === "object" && value !== null && "success" in value;
}

function route(
  method: string,
  segments: string[],
  body: unknown,
  ctx: MockContext,
): MockEnvelope<unknown> {
  const [, area, ...rest] = segments; // segments[0] === "api"

  /* ------------------------------- auth ---------------------------------- */
  if (area === "auth") {
    const action = rest[0];

    if (action === "login" && method === "POST") {
      const credentials = (body ?? {}) as LoginRequest;
      if (!MOCK_ADMIN_PASSWORD) {
        return fail(
          503,
          "Mock API mode has no admin credentials configured. Set VITE_MOCK_ADMIN_EMAIL and VITE_MOCK_ADMIN_PASSWORD, or point VITE_API_BASE_URL at the Spring Boot backend.",
        );
      }
      const emailMatches =
        credentials.email?.trim().toLowerCase() === MOCK_ADMIN_EMAIL.trim().toLowerCase();
      if (!emailMatches || credentials.password !== MOCK_ADMIN_PASSWORD) {
        return fail(401, "Invalid email or password.");
      }
      const user: AuthUser = {
        id: "admin-1",
        email: MOCK_ADMIN_EMAIL,
        name: db.profile.shortName,
        roles: ["ADMIN"],
      };
      logActivity("Signed in", "Auth", user.email);
      return ok(createSession(user));
    }

    if (action === "refresh" && method === "POST") {
      const session = sessionFor(ctx.token);
      if (!session) return fail(401, "Session expired.");
      sessions.delete(session.token);
      return ok(createSession(session.user));
    }

    if (action === "logout" && method === "POST") {
      if (ctx.token) sessions.delete(ctx.token);
      return ok<null>(null);
    }

    if (action === "me" && method === "GET") {
      const session = sessionFor(ctx.token);
      if (!session) return fail(401, "Session expired.");
      return ok(session.user);
    }
  }

  /* ------------------------------ public --------------------------------- */
  if (area !== "auth" && area !== "admin") {
    const resource = segments[1];

    if (method === "GET" && resource === "profile") return ok(db.profile);

    if (method === "GET" && resource && COLLECTION_BY_SEGMENT[resource]) {
      const collection = COLLECTION_BY_SEGMENT[resource];
      const slugOrId = segments[2];
      const items = sortByOrder(publishedOnly(list(collection)));

      if (collection === "projects" && slugOrId) {
        const project = items.find((item) => item["slug"] === slugOrId);
        return project ? ok(project) : fail(404, "Project not found.");
      }
      if (collection === "socialLinks") {
        return ok(items.filter((item) => item["active"] !== false));
      }
      return ok(items);
    }

    if (method === "POST" && resource === "contact") {
      const payload = (body ?? {}) as AnyRecord;
      if (!payload["email"] || !payload["message"]) {
        return fail(422, "Name, email, subject and message are required.");
      }
      db.messages.unshift({
        id: newId("msg"),
        name: String(payload["name"] ?? ""),
        email: String(payload["email"]),
        subject: String(payload["subject"] ?? ""),
        message: String(payload["message"]),
        read: false,
        createdAt: new Date().toISOString(),
      });
      logActivity("Received message", "Contact", String(payload["email"]));
      return ok({ received: true }, "Message received.");
    }
  }

  /* ------------------------------- admin --------------------------------- */
  if (area === "admin") {
    const guard = requireAdmin(ctx);
    if (isEnvelope(guard)) return guard;
    const actor = guard.user.email;
    const resource = rest[0];

    if (resource === "dashboard" && method === "GET") {
      const response: DashboardResponse = {
        stats: {
          totalProjects: db.projects.length,
          publishedProjects: db.projects.filter((p) => p.published !== false).length,
          totalSkills: db.skills.reduce((sum, category) => sum + category.skills.length, 0),
          certifications: db.certifications.length,
          unreadMessages: db.messages.filter((m) => !m.read).length,
          profileCompletion: profileCompletion(),
        },
        recentActivity: db.activity.slice(0, 8),
      };
      return ok(response);
    }

    if (resource === "activity" && method === "GET") {
      return ok<ActivityEntry[]>(db.activity);
    }

    if (resource === "operations" && rest[1] === "health") {
      // Never fabricate health data: only the real backend can report it.
      return fail(
        503,
        "Backend health cannot be verified while the app runs in mock API mode.",
      );
    }

    if (resource === "settings") {
      if (method === "GET") return ok(db.settings);
      if (method === "PUT") {
        db.settings = { ...db.settings, ...(body as AnyRecord) } as typeof db.settings;
        logActivity("Updated settings", "Settings", actor);
        return ok(db.settings, "Settings saved.");
      }
    }

    if (resource === "profile" && method === "PUT") {
      db.profile = { ...db.profile, ...(body as AnyRecord) };
      logActivity("Updated profile", "Profile", actor);
      return ok(db.profile, "Profile saved.");
    }

    if (resource === "media" && rest[1] === "upload" && method === "POST") {
      const file = ctx.formData?.get("file");
      if (!(file instanceof File)) return fail(422, "No file provided.");
      const response: MediaUploadResponse = {
        url: URL.createObjectURL(file),
        filename: file.name,
        contentType: file.type,
        size: file.size,
      };
      logActivity("Uploaded media", file.name, actor);
      return ok(response);
    }

    if (resource === "contact-messages") {
      const id = rest[1];
      if (method === "GET" && !id) return ok(db.messages);
      if (method === "GET" && id) {
        const message = db.messages.find((m) => m.id === id);
        return message ? ok(message) : fail(404, "Message not found.");
      }
      if ((method === "PATCH" || method === "PUT") && id && rest[2] === "read") {
        const message = db.messages.find((m) => m.id === id);
        if (!message) return fail(404, "Message not found.");
        message.read = true;
        logActivity("Marked message as read", message.subject || message.email, actor);
        return ok(message, "Message marked as read.");
      }
      if (method === "DELETE" && id) {
        const index = db.messages.findIndex((m) => m.id === id);
        if (index === -1) return fail(404, "Message not found.");
        db.messages.splice(index, 1);
        logActivity("Deleted message", id, actor);
        return ok<null>(null, "Message deleted.");
      }
    }

    if (resource && COLLECTION_BY_SEGMENT[resource]) {
      const collection = COLLECTION_BY_SEGMENT[resource];
      const label = LABEL_BY_COLLECTION[collection];
      const items = list(collection);
      const id = rest[1];

      if (method === "GET" && !id) return ok(sortByOrder(items));
      if (method === "GET" && id) {
        const item = items.find((entry) => entry["id"] === id);
        return item ? ok(item) : fail(404, `${label} not found.`);
      }

      if (method === "POST") {
        const payload = (body ?? {}) as AnyRecord;
        const record: AnyRecord = {
          published: true,
          ...payload,
          id: newId(collection),
          displayOrder: payload["displayOrder"] ?? nextOrder(items),
          updatedAt: new Date().toISOString(),
        };
        if (collection === "projects") {
          record["slug"] = slugify(String(payload["slug"] || payload["name"] || ""));
          if (!record["slug"]) return fail(422, "A URL-safe slug is required.");
          if (items.some((entry) => entry["slug"] === record["slug"])) {
            return fail(409, "A project with this slug already exists.");
          }
        }
        items.push(record);
        logActivity(`Created ${label.toLowerCase()}`, String(record["name"] ?? record["id"]), actor);
        return { data: record, message: `${label} created.`, success: true, status: 201 };
      }

      if (method === "PUT" && id) {
        const index = items.findIndex((entry) => entry["id"] === id);
        if (index === -1) return fail(404, `${label} not found.`);
        const payload = (body ?? {}) as AnyRecord;
        const updated: AnyRecord = {
          ...items[index],
          ...payload,
          id,
          updatedAt: new Date().toISOString(),
        };
        if (collection === "projects") {
          updated["slug"] = slugify(String(payload["slug"] || updated["slug"] || ""));
          if (items.some((entry) => entry["slug"] === updated["slug"] && entry["id"] !== id)) {
            return fail(409, "A project with this slug already exists.");
          }
        }
        items[index] = updated;
        logActivity(`Updated ${label.toLowerCase()}`, String(updated["name"] ?? id), actor);
        return ok(updated, `${label} saved.`);
      }

      if (method === "DELETE" && id) {
        const index = items.findIndex((entry) => entry["id"] === id);
        if (index === -1) return fail(404, `${label} not found.`);
        const [removed] = items.splice(index, 1);
        logActivity(`Deleted ${label.toLowerCase()}`, String(removed?.["name"] ?? id), actor);
        return ok<null>(null, `${label} deleted.`);
      }
    }
  }

  return fail(404, `No mock handler for ${method} /${segments.join("/")}.`);
}
