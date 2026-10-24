# Munito AI for pi

This pi package makes [Munito AI](https://munito.ai) a model provider of [pi](https://github.com/earendil-works/pi).
Munito AI serves open models for Europe, private by default, on an OpenAI-compatible API.

## Install

```bash
pi install git:github.com/munitoai/pi-provider
```

Create an API key at [console.munito.ai/keys](https://console.munito.ai/keys).
In pi, run `/login`, pick **Munito AI**, and paste the key. Or set `MUNITO_API_KEY` in your environment.
Then run `/model` and pick a Munito AI model.

## Providers

| Provider | Host | Use it when |
|---|---|---|
| `munito` (Munito AI) | `https://api.munito.ai/inference/v1` | Any region can process the request. |
| `munito-eu` (Munito AI (EU)) | `https://api.eu.munito.ai/inference/v1` | Each request must stay in the EU. |

Both use the same key.

## Models

| Model | Context | Input |
|---|---|---|
| `zai-org/glm-5.3-flash` | 1,048,576 | Text, images |
| `deepseek-ai/deepseek-v4-flash` | 1,048,576 | Text |
| `deepseek-ai/deepseek-v4.1-flash-1017` (preview, `munito` only) | 1,048,576 | Text, images |
| `qwen/qwen3.8-27b` | 262,144 | Text, images |
| `aleph-alpha/kolibri-1` | 1,048,576 | Text |

The prices are at [docs.munito.ai/models](https://docs.munito.ai/models). pi shows the cost of each session from them.

## Reasoning

pi sends its thinking level as `reasoning_effort`, and Munito AI moves each level to the nearest level that the model has.
`off` sends `none`: the model stops its reasoning, and a model that always reasons, such as GLM-5.3-Flash, runs its lowest level.
See [Reasoning models](https://docs.munito.ai/reasoning).

## Prompt cache

pi sends the session ID in the header `x-session-affinity`, and Munito AI keeps the conversation on its prompt cache.

## License

MIT
