export async function sendMessage(text: string) {
  console.log("发送消息....");
  await Promise.all([sendTGMessage(text), sendQWMessage(text)]);
}

interface ITGMessage {
  chat_id: string | number | undefined;
  text: string;
  parse_mode?: string;
}

export async function sendTGMessage(
  text: string,
  options: { type: "text" | "markdown"; receive: "person" | "channel" } = {
    type: "text",
    receive: "person",
  },
) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
  const chatId = options.receive === "person"
    ? Deno.env.get("TELEGRAM_CHAT_ID")
    : options.receive === "channel"
    ? Deno.env.get("TELEGRAM_CHANNEL_ID")
    : "";

  const body: ITGMessage = {
    chat_id: chatId,
    text,
  };

  if (options.type === "markdown") {
    body.parse_mode = "MarkdownV2";
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (res.status !== 200) {
      console.log(await res.text());
    }
  }).catch((err) => {
    console.error(err);
  });
}

export async function sendQWMessage(text: string) {
  const hooksURL = Deno.env.get("QYWECHAT_BOT_HOOKS") || "";
  await fetch(hooksURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msgtype: "text",
      text: {
        content: text,
      },
    }),
  });
}

export function escapeChar(text: string) {
  return text.replaceAll(".", "\\.").replaceAll("-", "\\-");
}
