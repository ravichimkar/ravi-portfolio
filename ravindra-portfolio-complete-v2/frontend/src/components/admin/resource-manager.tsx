import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import { AdminPage, ConfirmDialog, FormField, Panel, StatusPill, adminFieldClass } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/action-button";
import { AsyncBoundary } from "@/components/ui/async-boundary";
import { SkeletonRows } from "@/components/ui/skeletons";

export type FieldType =
  | "text"
  | "textarea"
  | "list"
  | "number"
  | "boolean"
  | "url"
  | "email"
  | "select"
  | "skillNames";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  full?: boolean;
}

export interface ResourceApi<T> {
  list: () => Promise<T[]>;
  create: (payload: Partial<T>) => Promise<T>;
  update: (id: string, payload: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<null>;
}

type Values = Record<string, unknown>;

function toFormValues(fields: FieldDef[], item?: Values): Values {
  const values: Values = {};
  for (const field of fields) {
    const raw = item?.[field.name];
    switch (field.type) {
      case "list":
        values[field.name] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
        break;
      case "skillNames":
        values[field.name] = Array.isArray(raw)
          ? (raw as { name: string }[]).map((entry) => entry.name).join("\n")
          : "";
        break;
      case "boolean":
        values[field.name] = raw === undefined ? true : Boolean(raw);
        break;
      case "number":
        values[field.name] = raw === undefined || raw === null ? "" : String(raw);
        break;
      default:
        values[field.name] = raw === undefined || raw === null ? "" : String(raw);
    }
  }
  return values;
}

function toPayload(fields: FieldDef[], values: Values): Values {
  const payload: Values = {};
  for (const field of fields) {
    const raw = values[field.name];
    switch (field.type) {
      case "list":
        payload[field.name] = String(raw ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        break;
      case "skillNames":
        payload[field.name] = String(raw ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((name) => ({ name }));
        break;
      case "boolean":
        payload[field.name] = Boolean(raw);
        break;
      case "number":
        payload[field.name] = raw === "" ? undefined : Number(raw);
        break;
      default:
        payload[field.name] = String(raw ?? "").trim();
    }
  }
  return payload;
}

function validate(fields: FieldDef[], values: Values) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const raw = values[field.name];
    const text = typeof raw === "string" ? raw.trim() : raw;
    if (field.required && (text === "" || text === undefined || text === null)) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (field.type === "url" && typeof text === "string" && text) {
      try {
        const url = new URL(text);
        if (!url.protocol.startsWith("http")) throw new Error("bad protocol");
      } catch {
        errors[field.name] = "Enter a valid URL starting with http(s)://";
      }
    }
    if (field.type === "email" && typeof text === "string" && text) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        errors[field.name] = "Enter a valid email address.";
      }
    }
  }
  return errors;
}

export function ResourceFields({
  fields,
  values,
  errors,
  onChange,
  idPrefix = "field",
}: {
  fields: FieldDef[];
  values: Values;
  errors: Record<string, string>;
  onChange: (name: string, value: unknown) => void;
  idPrefix?: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const value = values[field.name];
        const shared = { id, className: adminFieldClass };

        return (
          <div key={field.name} className={field.full || field.type !== "text" ? "sm:col-span-2" : undefined}>
            <FormField
              label={field.label}
              hint={field.hint}
              error={errors[field.name] ?? ""}
              htmlFor={id}
            >
              {field.type === "textarea" || field.type === "list" || field.type === "skillNames" ? (
                <textarea
                  {...shared}
                  rows={field.type === "textarea" ? 4 : 5}
                  value={String(value ?? "")}
                  placeholder={field.placeholder ?? ""}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              ) : field.type === "boolean" ? (
                <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    id={id}
                    type="checkbox"
                    className="size-4 accent-[var(--color-primary)]"
                    checked={Boolean(value)}
                    onChange={(event) => onChange(field.name, event.target.checked)}
                  />
                  <span className="text-muted-foreground">{field.hint ?? "Enabled"}</span>
                </label>
              ) : field.type === "select" ? (
                <select
                  {...shared}
                  value={String(value ?? "")}
                  onChange={(event) => onChange(field.name, event.target.value)}
                >
                  <option value="">Select…</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...shared}
                  type={field.type === "number" ? "number" : "text"}
                  inputMode={field.type === "number" ? "numeric" : undefined}
                  value={String(value ?? "")}
                  placeholder={field.placeholder ?? ""}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              )}
            </FormField>
          </div>
        );
      })}
    </div>
  );
}

export interface ResourceManagerProps<T extends { id: string }> {
  title: string;
  description: string;
  singular: string;
  queryKey: string;
  api: ResourceApi<T>;
  fields: FieldDef[];
  primary: (item: T) => string;
  secondary?: (item: T) => string;
  /** Opens the editor immediately (used by /new and /:id/edit routes). */
  initialAction?: { mode: "new" } | { mode: "edit"; id: string };
  onEditorClose?: () => void;
  searchable?: boolean;
  /** Hide the list (dedicated create/edit routes). */
  hideList?: boolean;
  /** Navigate to a dedicated create route instead of opening the inline editor. */
  onNewRoute?: () => void;
  /** Navigate to a dedicated edit route instead of opening the inline editor. */
  onEditRoute?: (item: T) => void;
}

export function ResourceManager<T extends { id: string; published?: boolean; displayOrder?: number }>({
  title,
  description,
  singular,
  queryKey,
  api,
  fields,
  primary,
  secondary,
  initialAction,
  onEditorClose,
  searchable = true,
  hideList = false,
  onNewRoute,
  onEditRoute,
}: ResourceManagerProps<T>) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [search, setSearch] = useState("");
  const appliedInitial = useRef(false);

  const query = useQuery({ queryKey: ["admin", queryKey], queryFn: api.list, retry: 0 });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", queryKey] });
    queryClient.invalidateQueries({ queryKey: ["public"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: Values) => {
      if (editing && editing !== "new") return api.update(editing.id, payload as Partial<T>);
      return api.create(payload as Partial<T>);
    },
    onSuccess: () => {
      toast.success(`${singular} saved successfully.`);
      setEditing(null);
      onEditorClose?.();
      invalidate();
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Unable to save ${singular.toLowerCase()}. Please try again.`,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (item: T) => api.remove(item.id),
    onSuccess: () => {
      toast.success(`${singular} deleted.`);
      setPendingDelete(null);
      invalidate();
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Unable to delete ${singular.toLowerCase()}. Please try again.`,
      );
    },
  });

  const startEdit = (item: T | "new") => {
    setEditing(item);
    setErrors({});
    setValues(toFormValues(fields, item === "new" ? undefined : (item as unknown as Values)));
  };

  const submit = () => {
    const nextErrors = validate(fields, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    saveMutation.mutate(toPayload(fields, values));
  };

  const allItems = useMemo(() => query.data ?? [], [query.data]);

  useEffect(() => {
    if (!initialAction || appliedInitial.current) return;
    if (initialAction.mode === "new") {
      appliedInitial.current = true;
      startEdit("new");
      return;
    }
    const match = allItems.find((item) => item.id === initialAction.id);
    if (match) {
      appliedInitial.current = true;
      startEdit(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAction, allItems]);

  const closeEditor = () => {
    setEditing(null);
    onEditorClose?.();
  };

  const items = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allItems;
    return allItems.filter((item) =>
      `${primary(item)} ${secondary?.(item) ?? ""}`.toLowerCase().includes(term),
    );
  }, [allItems, search, primary, secondary]);

  return (
    <AdminPage
      title={title}
      description={description}
      actions={
        <ActionButton
          variant="gold"
          size="sm"
          onClick={() => (onNewRoute ? onNewRoute() : startEdit("new"))}
        >
          <Plus className="size-4" />
          Add {singular.toLowerCase()}
        </ActionButton>
      }
    >
      {editing ? (
        <Panel
          className="mb-6"
          title={editing === "new" ? `New ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}
          description="Changes are saved through the API and reflected on the public site."
        >
          <ResourceFields
            fields={fields}
            values={values}
            errors={errors}
            idPrefix={queryKey}
            onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton variant="gold" size="sm" onClick={submit} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save changes"}
            </ActionButton>
            <ActionButton
              variant="ghost"
              size="sm"
              onClick={closeEditor}
              disabled={saveMutation.isPending}
            >
              Cancel
            </ActionButton>
          </div>
        </Panel>
      ) : null}

      {hideList ? null : (
        <>
      {searchable && allItems.length > 0 ? (
        <div className="mb-4">
          <label htmlFor={`${queryKey}-search`} className="sr-only">
            Search {title.toLowerCase()}
          </label>
          <input
            id={`${queryKey}-search`}
            type="search"
            value={search}
            placeholder={`Search ${title.toLowerCase()}…`}
            onChange={(event) => setSearch(event.target.value)}
            className={adminFieldClass}
          />
        </div>
      ) : null}

      <AsyncBoundary
        isPending={query.isPending}
        isError={query.isError}
        data={items}
        errorMessage={`${title} are temporarily unavailable.`}
        onRetry={() => query.refetch()}
        skeleton={<SkeletonRows />}
        isEmpty={(data) => data.length === 0}
        empty={
          <Panel>
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nothing here yet. Add your first {singular.toLowerCase()} to publish it on the site.
            </p>
          </Panel>
        }
      >
        {(data) => (
          <ul className="space-y-3">
            {data.map((item) => (
              <li
                key={item.id}
                className="surface-panel flex flex-wrap items-center gap-4 rounded-xl px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{primary(item)}</p>
                  {secondary ? (
                    <p className="truncate text-xs text-muted-foreground">{secondary(item)}</p>
                  ) : null}
                </div>
                <StatusPill tone={item.published === false ? "muted" : "cyan"}>
                  {item.published === false ? "Draft" : "Published"}
                </StatusPill>
                <span className="font-mono text-[10px] text-muted-foreground">
                  #{item.displayOrder ?? "—"}
                </span>
                <div className="flex gap-2">
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => (onEditRoute ? onEditRoute(item) : startEdit(item))}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </ActionButton>
                  <ActionButton variant="ghost" size="sm" onClick={() => setPendingDelete(item)}>
                    <Trash2 className="size-3.5" />
                    Delete
                  </ActionButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete this ${singular.toLowerCase()}?`}
        description="This action cannot be undone. The record will be removed from the public website."
        pending={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </AdminPage>
  );
}
