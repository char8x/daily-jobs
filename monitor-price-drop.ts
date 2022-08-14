import { load } from "cheerio";
import { sendMessage } from "/utils.ts";

const SUCCESS_MSG = "降价了，快去看; 若已下单，看看是否能申请保价";

async function trackPriceDrop(
  url: string,
  options: { itemTitle: string; currentPrice: number; successMsg?: string },
) {
  const { itemTitle, currentPrice, successMsg = SUCCESS_MSG } = options;
  const content = await fetch(
    url,
  )
    .then((res) => res.text());
  const $ = load(content);
  const priceText = $(
    "#bd > div > div.panel > div > div.price-wrap.cl > div > span > strong",
  ).text().trim();
  if (parseFloat(priceText) < currentPrice) {
    console.log(`${itemTitle} ${priceText}`);
    await sendMessage(`${itemTitle} ${successMsg}`);
  } else {
    console.log(`${itemTitle} ${priceText}`);
  }
}

await Promise.all([
  trackPriceDrop("https://www.miaomiaozhe.com/dvn/7726143786908001311", {
    itemTitle: "微波炉",
    currentPrice: 339,
  }),
  trackPriceDrop("https://www.miaomiaozhe.com/dvn/-7906896281343993642", {
    itemTitle: "鼠标",
    currentPrice: 549,
  }),
]);
