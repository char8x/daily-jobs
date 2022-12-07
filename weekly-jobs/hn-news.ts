import { sendTGMessage } from "/utils.ts";
import { endOfWeek, getUnixTime, startOfWeek } from "date-fns";
import { puppeteer } from "deps.ts";

const START_DATE = startOfWeek(new Date());
const END_DATE = endOfWeek(new Date());

const URL = `https://hn.algolia.com/?dateEnd=${
  getUnixTime(END_DATE)
}&dateRange=custom&dateStart=${
  getUnixTime(START_DATE)
}&page=0&prefix=false&query=&sort=byPopularity&type=story`;

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  await page.goto(URL);
  await page.waitForSelector("div.Story_title");

  // https://stackoverflow.com/a/61336937/19868378

  const list = await page.evaluate(() => {
    // https://stackoverflow.com/a/47314102/19868378
    const escapeChar = function (text) {
      return text.replaceAll(".", "\\.").replaceAll("-", "\\-").replaceAll(
        "(",
        "\\(",
      ).replaceAll(")", "\\)").replaceAll("+", "\\+").replaceAll("*", "\\*");
    };

    const data = Array.from(
      document.querySelectorAll(
        "#root > div > div > section > div > article:nth-child(-n+10) > div > div > div.Story_title",
      ),
    ).map((v) => {
      const title = v.querySelector("a:first-child").textContent;
      const url = v.querySelector("a:last-child").href;

      return `• [${escapeChar(title)}](${url})`;
    });

    return data;
  });

  await browser.close();

  if (list.length > 0) {
    const message = `\\#HackerNews一周新闻 ${
      new Intl.DateTimeFormat("zh-CN").format(new Date()).replaceAll("/", "\\-")
    }\n\n${list.join("\n\n")}\n\n[更多新闻](${URL})`;

    await sendTGMessage(message, { type: "markdown", receive: "channel" });
  }
} catch (error) {
  console.error({ error }, "Error happened!");

  Deno.exit();
}
