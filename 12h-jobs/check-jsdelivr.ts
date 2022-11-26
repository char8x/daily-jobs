import { Crypto } from "deps.ts";
import { sendMessage } from "/utils.ts";

async function sha1Hex(text: string) {
  const inputBytes = new TextEncoder().encode(text);

  return Crypto.toHashString(
    await Crypto.crypto.subtle.digest("SHA-1", inputBytes),
    "hex",
  );
}

function fetchContent(url: string) {
  return fetch(url).then((res) => res.text()).then(sha1Hex);
}

const resolvers = [
  "https://raw.githubusercontent.com/DNSCrypt/dnscrypt-resolvers/master/v3/public-resolvers.md",
  "https://cdn.jsdelivr.net/gh/DNSCrypt/dnscrypt-resolvers@master/v3/public-resolvers.md",
];

const resolversCheck = await Promise.all(resolvers.map(fetchContent)).then(
  (res) => res[0] === res[1],
);

// console.log(resolversCheck);

if (!resolversCheck) {
  await sendMessage("DNS resolvers check error!");
}
