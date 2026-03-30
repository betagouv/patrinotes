import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import multipart, { MultipartFile } from "@fastify/multipart";
import { AppError } from "../features/errors";
import util from "node:util";
import { pipeline } from "node:stream";
import { getPictureName } from "../services/uploadService";
import { db } from "../db/db";
import { makeDebug } from "../features/debug";
import { authenticate } from "./authMiddleware";
import fs from "fs/promises";
import path from "node:path";
import { NoSuchKey } from "@aws-sdk/client-s3";

const debug = makeDebug("upload");
const pump = util.promisify(pipeline);

export const uploadPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.register(multipart, {
    limits: {
      fileSize: 15 * 1024 * 1024, // 15 mo,
    },
  });
  fastify.addHook("preHandler", authenticate);

  fastify.get(
    "/attachment/presigned-url",
    {
      schema: {
        querystring: Type.Object({ filePath: Type.String() }),
        response: { 200: Type.Object({ url: Type.String() }) },
      },
    },
    async (request, reply) => {
      const { filePath } = request.query as any;
      if (!filePath) throw new AppError(400, "No filePath provided");
      const url = await request.services.upload.getPresignedUploadUrl({ filePath });
      reply.send({ url });
    },
  );

  fastify.get("/attachment", async (request, reply) => {
    const { filePath } = request.query as any;
    if (!filePath) throw new AppError(400, "No filePath provided");
    try {
      const fileBuffer = await request.services.upload.getAttachment({ filePath: decodeURIComponent(filePath) });

      reply.send(fileBuffer);
    } catch (error) {
      if (error instanceof NoSuchKey) {
        throw new AppError(404, "Attachment not found");
      }
    }
  });
};
