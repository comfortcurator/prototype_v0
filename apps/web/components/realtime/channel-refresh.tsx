"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeChannel } from "@/hooks/use-realtime-channel";

type Props = {
  channel: string;
  event: string;
};

/**
 * Subscribes to a realtime channel and triggers a Next.js router refresh whenever the event fires.
 * Useful for keeping server components in sync after background updates.
 */
export function ChannelRefresh({ channel, event }: Props) {
  const router = useRouter();

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useRealtimeChannel(channel, event, handleRefresh);

  return null;
}

