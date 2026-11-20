import assert from "node:assert/strict";
import test from "node:test";
import { checkedPhrase, checkedSpan } from "../src/lib/format.ts";

test("checked phrase uses the row date", () => {
  assert.equal(checkedPhrase("2026-11-19"), "Checked Nov 19, 2026");
  assert.equal(checkedPhrase("2026-11-20"), "Checked Nov 20, 2026");
});

test("checked span names one day or the Nov 19 to Nov 20 range", () => {
  assert.equal(checkedSpan(["2026-11-19"]), "Nov 19, 2026");
  assert.equal(checkedSpan(["2026-11-20"]), "Nov 20, 2026");
  assert.equal(checkedSpan(["2026-11-20", "2026-11-19", "2026-11-19"]), "Nov 19 to Nov 20, 2026");
});
