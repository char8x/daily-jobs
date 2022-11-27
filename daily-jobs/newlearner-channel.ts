import {
  DOMParser,
  Element,
  initParser,
  Node,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { escapeChar, sendTGMessage } from "/utils.ts";

// initialize when you need it, but not at the top level
await initParser();

const URL = "https://t.me/s/NewlearnerChannel?q=%23News";
const html = await fetch(URL).then((res) => res.text());

const doc = new DOMParser().parseFromString(
  html,
  "text/html",
);

function formatNode(elem: Node) {
  let content = "";
  while (elem.nodeName !== "BR") {
    if (elem.nodeName === "#text" && !!elem.textContent.trim()) {
      content += escapeChar(elem.textContent);
    }
    if (elem.nodeName === "A") {
      content += `[${escapeChar(elem.textContent)}](${
        (elem as Element).getAttribute("href")
      })`;
    }

    elem = elem.nextSibling;
  }
  return content;
}

const list = Array.from(
  doc?.querySelectorAll(
    `.tgme_widget_message_text.js-message_text`,
  ) ?? [],
).filter(
  (elem) => {
    const date = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
    }).format(new Date()).replaceAll("/", ".");

    return elem.textContent.includes(`自留地早报【${date}】`) ||
      elem.textContent.includes(`自留地晚报【${date}】`);
  },
).map((e) => {
  const elem = e as Element;

  return Array.from(elem.querySelectorAll("i.emoji")).slice(1).map(
    (v) => {
      return `• ${formatNode(v.nextSibling)}`;
    },
  );
}).reduce((pre, cur) => {
  return pre.concat(cur);
}, []);

if (list.length > 0) {
  const message = `\\#自留地日报 ${
    new Intl.DateTimeFormat("zh-CN").format(new Date()).replaceAll("/", "\\-")
  }\n\n${list.join("\n\n")}`;

  await sendTGMessage(message, { type: "markdown", receive: "channel" });
}
