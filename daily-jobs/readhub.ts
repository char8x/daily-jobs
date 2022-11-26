import { Cheerio, Element, load } from "cheerio";
import { sendTGMessage } from "/utils.ts";
const URL = "https://readhub.cn/daily";

const html = await fetch(URL).then((res) => res.text());

const $ = load(html);
const list = $(
  `div[class^="Daily_main"] > div > div[class^="Daily_list"] > div:nth-child(n) > a`,
).map((_, el) => {
  const elem: Cheerio<Element> = $(el);
  const title = elem.prop("innerText")?.replaceAll(/\./g, "\\.");
  const href = elem.prop("href") as string;
  return `• [${title}](${href.startsWith("http") ? href : `${URL}${href}`})`;
})
  .toArray();

const message = `\\#Readhub每日早报 ${
  new Intl.DateTimeFormat("zh-CN").format(new Date()).replaceAll("/", "\\-")
}\n\n${list.join("\n\n")}`;

await sendTGMessage(message, { type: "markdown", receive: "channel" });
