import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";

async function sendMessage() {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID") || "";

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "从 Github 发出消息!",
    }),
  });
}

await sendMessage()

// const html = await fetch("https://www.alfredapp.com/workflows/").then((res) =>
//   res.text()
// );

// const $ = load(html);
// const pageText = $(
//   "#workflowspage > section:nth-child(4) > div > div > p:nth-child(1)",
// ).text().trim();

// if (
//   pageText !==
//     "This page is currently being overhauled with a whole load of new amazing Workflows built by us and our community."
// ) {
//   // TODO: send message to telegram

// } else {
//   console.log(
//     "This page is currently being overhauled with a whole load of new amazing Workflows built by us and our community.",
//   );
// }
