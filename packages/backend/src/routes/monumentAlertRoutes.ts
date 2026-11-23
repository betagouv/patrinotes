import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { db } from "../db/db";
import { AppError } from "../features/errors";
import { authenticate } from "./authMiddleware";
import { deliverMonumentAlert } from "../features/alertDelivery";

export { getMonumentAlertRecipients } from "../features/alertRecipients";

/**
 * Alerts and annotations made from a fiche are written offline through PowerSync; once the row and its photos are
 * uploaded, the client asks the server to email it. The server also sends it on its own once the submitted row is
 * synced (features/alertDelivery.ts). Sending is claimed with `sent_at`, so it never leaves twice.
 */
export const monumentAlertPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.post("/send", { schema: sendMonumentAlertSchema }, async (request) => {
    const user = request.user!;
    const { id } = request.body;

    const alert = await db.selectFrom("monument_alert").select("service_id").where("id", "=", id).executeTakeFirst();
    // not uploaded yet: the client will try again
    if (!alert) return { status: "pending" as const };
    if (!user.service_id || alert.service_id !== user.service_id) throw new AppError(403, "Accès non autorisé");

    // the server may have sent it already, when the submitted row arrived through sync (DAT-10)
    return deliverMonumentAlert(id, { sender: user });
  });
};

export const sendMonumentAlertSchema = {
  body: Type.Object({ id: Type.String() }),
  response: {
    200: Type.Object({
      status: Type.Union([Type.Literal("sent"), Type.Literal("pending"), Type.Literal("not_sent")]),
      sentAt: Type.Optional(Type.String()),
    }),
  },
};
