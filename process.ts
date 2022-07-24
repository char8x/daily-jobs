import { cheerioLoad } from "./deps.ts";

async function sendMessage(text: string) {
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

const html = await fetch("https://www.alfredapp.com/workflows/").then((res) =>
  res.text()
);

const $ = cheerioLoad(html);
const pageText = $(
  "#workflowspage > section:nth-child(4) > div > div > p:nth-child(1)",
).text().trim();

if (
  pageText !==
    "This page is currently being overhauled with a whole load of new amazing Workflows built by us and our community."
) {
  await sendMessage("Alfred Workflows Store 已经开放了，快去查看!");
} else {
  console.log("==============================");
  console.log(pageText);
  console.log("==============================");
}
