import { puppeteer } from "./deps.ts";

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  await page.goto("https://www.bing.com/");
  await page.waitForSelector("#footer");
  const title = await page.title();
  console.log(title);
} catch (error) {
  console.error({ error }, "Something happened!");
} finally {
  await browser.close();
}
