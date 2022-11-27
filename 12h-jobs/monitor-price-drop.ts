import {
  DOMParser,
  initParser,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { sendMessage } from "/utils.ts";

await initParser();

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

  const doc = new DOMParser().parseFromString(
    content,
    "text/html",
  );

  const priceText = doc?.querySelector(
    "#bd > div > div.panel > div > div.price-wrap.cl > div > span > strong",
  )?.textContent.trim() ?? "";
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
]);
