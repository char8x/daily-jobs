import { load } from "cheerio";
import { sendMessage } from "/utils.ts";

const content = await fetch(
  "https://www.miaomiaozhe.com/dvn/7726143786908001311",
)
  .then((res) => res.text());
const $ = load(content);
const priceText = $(
  "#bd > div > div.panel > div > div.price-wrap.cl > div > span > strong",
).text().trim();
if (parseFloat(priceText) < 339) {
  sendMessage("微波炉降价了，快去看");
} else {
  console.log(priceText);
}
