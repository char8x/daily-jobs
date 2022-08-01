import { semver } from "./deps.ts";
import { sendMessage } from "./utils.ts";

const content = await fetch(
  "https://raw.githubusercontent.com/Homebrew/homebrew-core/master/Formula/deno.rb",
).then((res) => res.text());

const onlineVersion = semver.valid(
  Array.from(
    // \/(.*?)\/ match content between / and /
    content.matchAll(/\/download\/(.*?)\/deno_src\.tar\.gz/g),
  ).flat().at(1) || "",
);
const localVersion = "1.24.1";

console.log(`onlineVersion: ${onlineVersion}`);
console.log(`localVersion: ${localVersion}`);

if (semver.gt(onlineVersion || "", localVersion)) {
  // send msg
  await sendMessage("Homebrew Deno 版本已升级，请及时更新");
}
