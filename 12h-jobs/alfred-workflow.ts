import {
  DOMParser,
  initParser,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { sendMessage } from "/utils.ts";

await initParser();

const html = await fetch("https://www.alfredapp.com/workflows/").then((res) =>
  res.text()
);

const doc = new DOMParser().parseFromString(
  html,
  "text/html",
);

const pageText = doc?.querySelector(
  "#workflowspage > section:nth-child(4) > div > div > p:nth-child(1)",
)?.textContent.trim();

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
