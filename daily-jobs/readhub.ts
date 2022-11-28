import {
  DOMParser,
  Element,
  initParser,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { sendTGMessage } from "/utils.ts";

await initParser();

const URL = "https://readhub.cn/daily";

const html = await fetch(URL).then((res) => res.text());

const doc = new DOMParser().parseFromString(
  html,
  "text/html",
);

const list = Array.from(
  doc?.querySelectorAll(
    `div[class^="Daily_main"] > div > div[class^="Daily_list"] > div:nth-child(n) > a`,
  ) ?? [],
).map((e) => {
  const elem = e as Element;
  const title = elem.innerText?.replaceAll(/\./g, "\\.");
  const href = elem.getAttribute("href") ?? "";
  return `• [${title}](${
    href.startsWith("http") ? href : `https://readhub.cn${href}`
  })`;
});

const message = `\\#Readhub每日早报 ${
  new Intl.DateTimeFormat("zh-CN").format(new Date()).replaceAll("/", "\\-")
}\n\n${list.join("\n\n")}`;

await sendTGMessage(message, { type: "markdown", receive: "channel" });
