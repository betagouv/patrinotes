import { EncodingType, StorageAdapter } from "@powersync/attachments";
import { api } from "../api";
import { createStore, del, get, set } from "idb-keyval";
import { decodeBase64 } from "../utils";

const attachmentsStore = createStore("attachments-db", "attachments");

export class AttachmentStorage implements StorageAdapter {
  async uploadFile(filePath: string, data: ArrayBuffer): Promise<void> {
    const formData = new FormData();
    formData.append("file", new Blob([data]), filePath);
    await api.post("/api/upload/attachment", { body: formData, query: { filePath } } as any);
  }

  async downloadFile(filePath: string): Promise<Blob> {
    const data = (await api.get("/api/upload/attachment", { query: { filePath: filePath } } as any)) as ArrayBuffer;

    return new Blob([data]);
  }

  async writeFile(
    fileUri: string,
    base64Data: string | ArrayBuffer,
    options?: { encoding?: EncodingType },
  ): Promise<void> {
    const data = typeof base64Data === "string" ? decodeBase64(base64Data) : base64Data;
    await set(fileUri, new Uint8Array(data), attachmentsStore);
  }

  async deleteFile(uri: string, options?: { filename?: string }): Promise<void> {
    await del(uri, attachmentsStore);
  }

  async fileExists(fileUri: string): Promise<boolean> {
    try {
      const exists = await get(fileUri, attachmentsStore);
      const result = exists !== undefined && exists !== null;

      return result;
    } catch (error) {
      console.error("fileExists error:", error);
      return false;
    }
  }

  copyFile(sourceUri: string, targetUri: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getUserStorageDirectory(): string {
    return "/";
  }

  makeDir(uri: string): Promise<void> {
    return Promise.resolve();
  }

  async readFile(fileUri: string, options?: { encoding?: EncodingType; mediaType?: string }): Promise<ArrayBuffer> {
    const content = await get(fileUri, attachmentsStore);

    if (!content || content === undefined || content === null) {
      console.error("File not found in readFile:", fileUri);

      return new ArrayBuffer(0);
    }

    // Convert Uint8Array to ArrayBuffer
    return content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
  }
}
