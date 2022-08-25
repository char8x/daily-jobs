export async function sendMessage(text: string) {
  console.log("发送消息....");
  await Promise.all([sendTGMessage(text), sendQWMessage(text)]);
}

export async function sendTGMessage(text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID") || "";

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
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
