import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AttachmentState } from "@powersync/web";
import { attachmentLocalStorage } from "../../../db/db";

/** Loads a blob URL from local storage regardless of sync state (for pending/transitioning attachments). */
export function useImageBlobUrlDirect(
  localUri: string | null | undefined,
  mediaType: string | null | undefined,
): string | null {
  const query = useQuery({
    queryKey: ["image-blob-url-direct", localUri],
    queryFn: async () => {
      const buffer = await attachmentLocalStorage.readFile(localUri!);
      const blob = new Blob([buffer], { type: mediaType || "image/jpeg" });
      return URL.createObjectURL(blob);
    },
    enabled: !!localUri,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const prevUrlRef = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, [query.data]);

  const stableUrlRef = useRef<string | null>(null);
  if (query.data && query.data !== stableUrlRef.current) {
    if (prevUrlRef.current && prevUrlRef.current !== query.data) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    prevUrlRef.current = query.data;
    stableUrlRef.current = query.data;
  }

  return stableUrlRef.current;
}

export function useImageBlobUrl(
  localUri: string | null | undefined,
  mediaType: string | null | undefined,
  state: number | null | undefined,
): string | null {
  const query = useQuery({
    queryKey: ["image-blob-url", localUri, state],
    queryFn: async () => {
      const buffer = await attachmentLocalStorage.readFile(localUri!);
      const blob = new Blob([buffer], { type: mediaType || "image/jpeg" });
      return URL.createObjectURL(blob);
    },
    enabled: !!localUri && state === AttachmentState.SYNCED,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Revoke the previous URL when a new one arrives or on unmount
  const prevUrlRef = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, [query.data]);

  // Latch: keep the last valid URL to avoid canvas flicker during re-renders
  const stableUrlRef = useRef<string | null>(null);
  if (query.data && query.data !== stableUrlRef.current) {
    if (prevUrlRef.current && prevUrlRef.current !== query.data) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    prevUrlRef.current = query.data;
    stableUrlRef.current = query.data;
  }

  return stableUrlRef.current;
}
