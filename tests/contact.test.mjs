import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const emailScript = await readFile(new URL("../email.js", import.meta.url), "utf8");
const attributes = (source) => Object.fromEntries(
  [...source.matchAll(/\b([\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2].replaceAll("&amp;", "&")]),
);
const anchors = [...html.matchAll(/<a\b([^>]*)>/g)].map((match) => attributes(match[1]));
const copyButtons = [...html.matchAll(/<button\b([^>]*)>/g)]
  .filter((match) => match[1].includes("data-copy-email="))
  .map((match) => ({ ...attributes(match[1]), hidden: /\bhidden\b/.test(match[1]) }));

test("every email action has the intended recipient and an encoded, nonempty subject", () => {
  const emailLinks = anchors.filter((link) => link.href?.startsWith("mailto:"));
  assert.ok(emailLinks.length >= 7, "Application, FAQ, request, contact, and footer email actions must exist");
  for (const link of emailLinks) {
    const url = new URL(link.href);
    assert.ok(!/[\s\r\n]/.test(link.href), `Email URL must be encoded: ${link.href}`);
    assert.deepEqual([...url.searchParams.keys()], ["subject"]);
    if (url.pathname === "iaeste@inbox.ru") {
      assert.equal(url.searchParams.get("subject"), "IAESTE Tajikistan — Summer 2027 application");
    } else {
      assert.equal(url.pathname, "tajikistan@iaeste.org");
      assert.equal(url.searchParams.get("subject"), link.class === "document-request"
        ? "IAESTE Khujand — Liability policy request"
        : "Enquiry for IAESTE Khujand");
    }
  }
  assert.equal(anchors.find((link) => link.class === "document-request")?.href?.split("?")[0],
    "mailto:tajikistan@iaeste.org");
});

test("contact navigation and phone links work without JavaScript", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "Duplicate IDs break section and email targets");
  for (const link of anchors.filter((link) => link.href?.startsWith("#"))) {
    assert.ok(ids.includes(link.href.slice(1)), `Missing anchor destination: ${link.href}`);
  }
  const contactLinks = anchors.filter((link) => link.href === "#contact");
  assert.ok(contactLinks.length >= 3, "Header, hero, and footer must reach the contact section");
  const phoneLinks = anchors.filter((link) => link.href?.startsWith("tel:"));
  assert.ok(phoneLinks.length >= 3, "FAQ, contact, and footer calling actions must exist");
  for (const link of phoneLinks) assert.equal(link.href, "tel:+992927735005");
});

test("copy controls have native email sources, accessible feedback, and ship with the site", async () => {
  assert.equal(copyButtons.length, 2);
  for (const button of copyButtons) {
    assert.ok(button.hidden, "Optional copy controls stay hidden without JavaScript");
    assert.equal(button.type, "button");
    assert.ok(button["aria-label"]);
    assert.ok(anchors.find((link) => link.id === button["data-copy-email"])?.href.startsWith("mailto:"));
    assert.match(html, new RegExp(`id="${button["aria-describedby"]}" role="status"`));
  }
  assert.match(html, /<script src="email\.js\?v=\d+" defer><\/script>/);
  const workflow = await readFile(new URL("../.github/workflows/deploy-cloudflare.yml", import.meta.url), "utf8");
  assert.match(workflow, /cp index\.html[^\n]*\bemail\.js\b/);
  assert.match(workflow, /node --test tests\/contact\.test\.mjs/);
});

function loadCopyControls(navigator) {
  const elements = new Map();
  for (const link of anchors.filter((link) => link.id)) elements.set(link.id, link);
  const buttons = copyButtons.map((source) => {
    const status = { textContent: "" };
    elements.set(source["aria-describedby"], status);
    return {
      hidden: source.hidden,
      disabled: false,
      dataset: { copyEmail: source["data-copy-email"] },
      getAttribute: (name) => source[name],
      addEventListener(type, handler) { assert.equal(type, "click"); this.click = handler; },
      status,
      email: new URL(elements.get(source["data-copy-email"]).href).pathname,
    };
  });
  runInNewContext(emailScript, {
    URL,
    navigator,
    document: {
      querySelectorAll: () => buttons,
      getElementById: (id) => elements.get(id),
    },
  });
  return buttons;
}

test("copying each address excludes the subject and reports success only after the write succeeds", async () => {
  let complete;
  const copied = [];
  const buttons = loadCopyControls({ clipboard: { writeText: (value) => {
    copied.push(value);
    return new Promise((resolve) => { complete = resolve; });
  } } });
  for (const button of buttons) {
    assert.equal(button.hidden, false);
    const pending = button.click();
    assert.equal(button.disabled, true);
    assert.equal(button.status.textContent, "");
    assert.equal(copied.at(-1), button.email);
    complete();
    await pending;
    assert.equal(button.disabled, false);
    assert.equal(button.status.textContent, `Copied ${button.email}. Paste it into your email service.`);
  }
});

for (const [name, navigator] of [
  ["clipboard access is denied", { clipboard: { writeText: async () => { throw new Error("Permission denied"); } } }],
  ["the browser has no clipboard API", {}],
]) {
  test(`manual copying remains available when ${name}`, async () => {
    const buttons = loadCopyControls(navigator);
    for (const button of buttons) {
      await button.click();
      assert.equal(button.disabled, false);
      assert.equal(button.status.textContent, `Copy unavailable. Select and copy this address: ${button.email}`);
    }
  });
}
