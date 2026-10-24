import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import data from "./models.json";

type Price = { input: number; cachedInput: number; output: number };

// Munito refuses `prompt_cache_retention`, and it routes a conversation to its cache by `x-session-affinity`.
// The `openai-nosession` format sends that header without `session_id`.
const compat = {
  supportsStore: false,
  supportsDeveloperRole: false,
  maxTokensField: "max_tokens",
  supportsLongCacheRetention: false,
  sendSessionAffinityHeaders: true,
  sessionAffinityFormat: "openai-nosession",
} as const;

// pi sends xhigh and max only when the map names them. Munito moves each level to the nearest one that the model has,
// and `none` turns reasoning off, or runs the lowest level of a model that always reasons.
const thinkingLevelMap = { off: "none", xhigh: "xhigh", max: "max" };

export default function munito(pi: ExtensionAPI) {
  for (const [provider, { name, baseUrl }] of Object.entries(data.providers)) {
    pi.registerProvider(provider, {
      name,
      baseUrl,
      apiKey: "$MUNITO_API_KEY",
      api: "openai-completions",
      models: data.models.flatMap((model) => {
        const price = (model.price as Record<string, Price | undefined>)[provider];
        if (!price) return [];
        return [
          {
            id: model.id,
            name: model.name,
            reasoning: true,
            input: model.input as ("text" | "image")[],
            contextWindow: model.context,
            maxTokens: model.maxOutput,
            cost: { input: price.input, output: price.output, cacheRead: price.cachedInput, cacheWrite: price.input },
            thinkingLevelMap,
            compat,
          },
        ];
      }),
    });
  }
}
