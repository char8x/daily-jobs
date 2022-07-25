export async function sendMessage(text: string) {
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
