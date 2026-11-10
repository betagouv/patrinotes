import { AttachmentState } from "@powersync/web";
import { useEffect, useRef } from "react";
import { api } from "../../../api";
import { useUser } from "../../../contexts/AuthContext";
import { db, powerSyncDb, useDbQuery } from "../../../db/db";
import { useIsOnline } from "../../../hooks/useIsOnline";

const RETRY_DELAY_MS = 30_000;

/**
 * Emails the alerts and annotations the user validated on a fiche, possibly offline: once the row and its photos
 * are uploaded, asks the backend to send it. The backend sets `sent_at` (synced back), so each one is sent once.
 */
export const MonumentAlertOutbox = () => {
  const user = useUser();
  if (!user) return null;
  return <Outbox userId={user.id} />;
};

const Outbox = ({ userId }: { userId: string }) => {
  const isOnline = useIsOnline();
  const pendingQuery = useDbQuery(
    db
      .selectFrom("monument_alert")
      .select("id")
      .where("status", "=", "submitted")
      .where("should_send", "=", 1)
      .where("sent_at", "is", null)
      .where("created_by", "=", userId),
    [userId],
  );
  const pendingIds = (pendingQuery.data ?? []).map((row) => row.id);
  const pendingKey = pendingIds.join(",");

  // last attempt per alert, and alerts the backend already sent (until `sent_at` syncs back)
  const lastAttemptRef = useRef(new Map<string, number>());
  const sentRef = useRef(new Set<string>());
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!isOnline || !pendingIds.length) return;

    const run = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      try {
        // the alert row must reach the backend first
        const queue = await powerSyncDb.getUploadQueueStats();
        if (queue.count > 0) return;

        for (const id of pendingIds) {
          if (sentRef.current.has(id)) continue;
          const lastAttempt = lastAttemptRef.current.get(id) ?? 0;
          if (Date.now() - lastAttempt < RETRY_DELAY_MS) continue;

          // and its photos the storage
          const attachments = await db
            .selectFrom("monument_alert_attachment")
            .leftJoin("attachments", "attachments.id", "monument_alert_attachment.attachment_id")
            .select("attachments.state")
            .where("monument_alert_attachment.monument_alert_id", "=", id)
            .where("monument_alert_attachment.is_deprecated", "=", 0)
            .execute();
          if (attachments.some((a) => a.state !== null && a.state !== AttachmentState.SYNCED)) continue;

          lastAttemptRef.current.set(id, Date.now());
          try {
            const result = await api.post("/api/monument-alert/send", { body: { id } });
            if (result.status === "sent" || result.status === "not_sent") sentRef.current.add(id);
          } catch (error) {
            console.error("Could not send the alert", id, error);
          }
        }
      } finally {
        isRunningRef.current = false;
      }
    };

    run();
    const interval = setInterval(run, RETRY_DELAY_MS / 2);
    return () => clearInterval(interval);
  }, [isOnline, pendingKey]);

  return null;
};
