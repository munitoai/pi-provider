import assert from "node:assert/strict";
import test from "node:test";
import munito from "../index.ts";

const providers = new Map();
munito({ registerProvider: (name, config) => providers.set(name, config) });

test("Gemma offers text input without reasoning on both endpoints", () => {
  for (const provider of ["munito", "munito-eu"]) {
    const model = providers.get(provider).models.find(({ id }) => id === "google/gemma-4-12b");
    assert.ok(model);
    assert.deepEqual(model.input, ["text"]);
    assert.equal(model.reasoning, false);
    assert.equal(model.contextWindow, 32768);
    assert.equal(model.maxTokens, 29491);
  }
});

test("chat providers exclude decision models", () => {
  for (const config of providers.values()) {
    assert.equal(config.api, "openai-completions");
    assert.ok(config.models.length > 0);
    assert.ok(config.models.every((model) => model.maxTokens > 0));
    assert.ok(config.models.every(({ id }) => !["blockbrain/cygnet", "perplexity-ai/pplx-decider-v1.2"].includes(id)));
  }
});

test("DeepSeek keeps reasoning and the standard EU prices", () => {
  const model = providers.get("munito-eu").models.find(({ id }) => id === "deepseek-ai/deepseek-v4.1-flash-1017");
  assert.ok(model);
  assert.equal(model.reasoning, true);
  assert.deepEqual(model.input, ["text", "image"]);
  assert.deepEqual(model.cost, { input: 0.3, output: 1.2, cacheRead: 0.006, cacheWrite: 0.3 });
});
