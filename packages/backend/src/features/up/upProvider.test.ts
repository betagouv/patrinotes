import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DataspaceUpProvider } from "./upProvider";

describe("DataspaceUpProvider", () => {
  let server: Server;
  let url: string;

  beforeAll(async () => {
    // Mimics the dataspace API: 404 when nothing matches, 500 for the "BROKEN" reference.
    server = createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const filter = JSON.parse(body);
        if (filter.UPI_REFERENCE_MERIMEE === "PA1") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([{ _id: "1", UPI_REFERENCE_MERIMEE: "PA1" }]));
        } else if (filter.UPI_REFERENCE_MERIMEE === "BROKEN") {
          res.writeHead(500);
          res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Not found" }));
        }
      });
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  it("returns the matching documents", async () => {
    expect(await new DataspaceUpProvider(url, "key").findByReferenceMerimee("PA1")).toHaveLength(1);
  });

  it("treats a 404 as no document", async () => {
    expect(await new DataspaceUpProvider(url, "key").findByReferenceMerimee("PA99999999")).toEqual([]);
  });

  it("still fails on server errors", async () => {
    await expect(new DataspaceUpProvider(url, "key").findByReferenceMerimee("BROKEN")).rejects.toThrow();
  });
});
