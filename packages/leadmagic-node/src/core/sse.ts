export interface ServerSentEvent {
  /** Parsed JSON when the data is JSON, otherwise the raw text. */
  data: unknown;
  /** The `event:` field; `message` when the server sent none. */
  event: string;
  id: string | undefined;
}

const LINE = /\r\n|\r|\n/u;
const LEADING_SPACE = /^ /u;

function parseData(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

/** One event from its lines, or null for a comment-only or empty block. */
function toEvent(block: string): ServerSentEvent | null {
  let event = "message";
  let id: string | undefined;
  const data: string[] = [];
  for (const line of block.split(LINE)) {
    if (!line || line.startsWith(":")) {
      continue;
    }
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    const value =
      colon === -1 ? "" : line.slice(colon + 1).replace(LEADING_SPACE, "");
    if (field === "event") {
      event = value;
    } else if (field === "data") {
      data.push(value);
    } else if (field === "id") {
      id = value;
    }
  }
  if (data.length === 0) {
    return null;
  }
  return { event, id, data: parseData(data.join("\n")) };
}

const BLOCK_END = /\r\n\r\n|\n\n|\r\r/u;

/** Reads a `text/event-stream` body event by event. */
export async function* readEvents(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<ServerSentEvent, void, undefined> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;
  try {
    while (!finished) {
      // biome-ignore lint/performance/noAwaitInLoops: a stream is read in order.
      const { done, value } = await reader.read();
      buffer += done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });
      let match = BLOCK_END.exec(buffer);
      while (match) {
        const event = toEvent(buffer.slice(0, match.index));
        buffer = buffer.slice(match.index + match[0].length);
        if (event) {
          yield event;
        }
        match = BLOCK_END.exec(buffer);
      }
      if (done) {
        const last = toEvent(buffer);
        if (last) {
          yield last;
        }
        finished = true;
      }
    }
  } finally {
    // Stops the download when the caller breaks out early.
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
