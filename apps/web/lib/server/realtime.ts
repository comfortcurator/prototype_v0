import type { RealtimeChannel } from "@supabase/supabase-js";
import { env } from "@/env";
import { logger } from "@/lib/server/logger";
import { getSupabaseServiceClient } from "./supabase";

export type RealtimeEvent = {
  channel: string;
  event: string;
  payload: Record<string, unknown>;
};

const channelCache = new Map<string, RealtimeChannel>();

export function isRealtimeEnabled(): boolean {
  return Boolean(env.supabaseServiceRoleKey);
}

function ensureBroadcastChannel(name: string): RealtimeChannel {
  const cached = channelCache.get(name);
  if (cached) {
    return cached;
  }

  const client = getSupabaseServiceClient();
  const channel = client.channel(name, {
    config: {
      broadcast: {
        ack: true,
        self: false
      }
    }
  });

  try {
    channel.subscribe((status, err) => {
      if (err) {
        logger.error({ source: "realtime", status, err }, "Supabase channel subscription error");
      }
    });
  } catch (error) {
    logger.error({ source: "realtime", error }, "Failed to subscribe to Supabase broadcast channel");
  }

  channelCache.set(name, channel);
  return channel;
}

export async function publishRealtimeEvent(event: RealtimeEvent) {
  if (!isRealtimeEnabled()) {
    logger.debug(
      { source: "realtime", event, reason: "supabase_not_configured" },
      "Supabase realtime not configured; skipping publish."
    );
    return;
  }

  try {
    const channel = ensureBroadcastChannel(event.channel);
    const response = await channel.send({
      type: "broadcast",
      event: event.event,
      payload: event.payload
    });
    const responseError = (response as { error?: unknown }).error;
    if (responseError) {
      logger.error(
        { source: "realtime", error: responseError, event },
        "Failed to publish realtime event"
      );
    }
  } catch (error) {
    logger.error({ source: "realtime", error, event }, "Unexpected error publishing realtime event");
  }
}

