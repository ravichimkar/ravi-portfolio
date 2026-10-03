import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { contactApi } from "@/api/contactApi";
import { AdminPage, ConfirmDialog, Panel, StatusPill } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/action-button";
import { AsyncBoundary } from "@/components/ui/async-boundary";
import { SkeletonRows } from "@/components/ui/skeletons";
import { adminQueries } from "@/lib/queries";
import type { ContactMessageRecord } from "@/api/types";

export const Route = createFileRoute("/admin/_shell/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const query = useQuery(adminQueries.messages());
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<ContactMessageRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactMessageRecord | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const markRead = useMutation({
    mutationFn: (id: string) => contactApi.markRead(id),
    onSuccess: () => {
      toast.success("Message marked as read.");
      invalidate();
    },
    onError: () => toast.error("Unable to update message. Please try again."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => contactApi.remove(id),
    onSuccess: () => {
      toast.success("Message deleted.");
      setPendingDelete(null);
      setOpen(null);
      invalidate();
    },
    onError: () => toast.error("Unable to delete message. Please try again."),
  });

  return (
    <AdminPage title="Messages" description="Submissions received through the public contact form.">
      <AsyncBoundary
        isPending={query.isPending}
        isError={query.isError}
        data={query.data}
        errorMessage="Messages are temporarily unavailable."
        onRetry={() => query.refetch()}
        skeleton={<SkeletonRows />}
        isEmpty={(data) => data.length === 0}
        empty={
          <Panel>
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. New contact submissions will appear here.
            </p>
          </Panel>
        }
      >
        {(data) => (
          <ul className="space-y-3">
            {data.map((message) => (
              <li key={message.id} className="surface-panel rounded-xl px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {message.subject || "(no subject)"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {message.name} · {message.email} ·{" "}
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <StatusPill tone={message.read ? "muted" : "cyan"}>
                    {message.read ? "Read" : "Unread"}
                  </StatusPill>
                  <div className="flex gap-2">
                    <ActionButton
                      variant="outline"
                      size="sm"
                      onClick={() => setOpen(open?.id === message.id ? null : message)}
                    >
                      View
                    </ActionButton>
                    {!message.read ? (
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => markRead.mutate(message.id)}
                        disabled={markRead.isPending}
                      >
                        Mark read
                      </ActionButton>
                    ) : null}
                    <ActionButton variant="ghost" size="sm" onClick={() => setPendingDelete(message)}>
                      Delete
                    </ActionButton>
                  </div>
                </div>
                {open?.id === message.id ? (
                  <p className="mt-4 border-l border-accent/40 pl-4 text-sm whitespace-pre-wrap text-muted-foreground">
                    {message.message}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Delete this message?"
        description="This permanently removes the message from the inbox."
        pending={remove.isPending}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </AdminPage>
  );
}
