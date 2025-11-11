"use client";

import { useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/client/supabase-browser";

type Handler<TPayload> = (payload: TPayload) => void;

/**
 * Subscribe to a Supabase broadcast channel and trigger a callback whenever the event fires.
 * Automatically cleans up the subscription on unmount.
 */
export function useRealtimeChannel<TPayload = Record<string, unknown>>(
  channelName: string,
  eventName: string,
  onMessage: Handler<TPayload>
) {
  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    const supabase = getSupabaseBrowserClient();

    channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel.on(
      "broadcast" as any,
      { event: eventName },
      (payload: { payload: TPayload }) => {
        onMessage(payload.payload);
      }
    );

    channel.subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channelName, eventName, onMessage]);
}

