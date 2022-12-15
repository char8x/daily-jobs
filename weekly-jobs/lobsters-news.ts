import {
  DOMParser,
  initParser,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { escapeChar, sendTGMessage } from "/utils.ts";

// initialize when you need it, but not at the top level
await initParser();

const URL = "https://lobste.rs/top/page/1";
const html = await fetch(URL).then((res) => res.text());

const doc = new DOMParser().parseFromString(
  html,
  "text/html",
);

const list = Array.from(
  doc?.querySelectorAll(
    `.story > div > div.details > span.link.h-cite.u-repost-of > a`,
  ) ?? [],
).slice(0, 10).map((e) =>
  `• [${escapeChar(e.textContent)}](${e.getAttribute("href")})`
);

if (list.length > 0) {
  const message = `\\#Lobsters ${
    new Intl.DateTimeFormat("zh-CN").format(new Date()).replaceAll("/", "\\-")
  }\n\n${list.join("\n\n")}\n\n[更多新闻](${URL})`;

  await sendTGMessage(message, { type: "markdown", receive: "channel" });
}
