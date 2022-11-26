import { load } from "cheerio";
import { sendMessage } from "/utils.ts";

const html = await fetch("https://www.alfredapp.com/workflows/").then((res) =>
  res.text()
);

const $ = load(html);
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
