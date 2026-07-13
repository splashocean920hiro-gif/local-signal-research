import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the LOCAL SIGNAL research app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LOCAL SIGNAL \| 地域店舗リサーチ<\/title>/i);
  assert.match(html, /いい店なのに/);
  assert.match(html, /検索条件を入力/);
  assert.match(html, /営業候補を確認/);
  assert.match(html, /API設定ガイド/);
  assert.doesNotMatch(html, /BOULANGERIE MUGUET|Your site is taking shape/);
});
