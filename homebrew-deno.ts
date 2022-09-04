import { semver } from "./deps.ts";
import { sendMessage } from "./utils.ts";
import * as toml from "https://deno.land/std@0.154.0/encoding/toml.ts";

const content = await fetch(
  "https://raw.githubusercontent.com/Homebrew/homebrew-core/master/Formula/deno.rb",
).then((res) => res.text());

const homeBrewVersion = semver.valid(
  Array.from(
    // \/(.*?)\/ match content between / and /
    content.matchAll(/\/download\/(.*?)\/deno_src\.tar\.gz/g),
  ).flat().at(1) || "",
);

const denoCargo = await fetch(
  "https://raw.githubusercontent.com/denoland/deno/main/cli/Cargo.toml",
).then((res) => res.text());
const conf = toml.parse(denoCargo);

// @ts-ignore
const denoVersion = conf["package"]["version"];

console.log(`homeBrewVersion: ${homeBrewVersion}`);
console.log(`denoVersion: ${denoVersion}`);

if (semver.eq(homeBrewVersion || "", denoVersion)) {
  // send msg
  await sendMessage("Homebrew Deno 版本已为最新，请及时更新");
}
