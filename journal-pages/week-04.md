---
layout: default
---

# Week 04

[← Back to Home](../index.md)

## Documentation 

### Activity 1: Local AI with Ollama

In this activity, I chose to use qwen3 8b as the local model. I tried having them write some p5.js code and then comparing their code with online AI.

```Prompt
create a flowing fountain using p5.js.
```
<iframe src="https://editor.p5js.org/chengyuehan/full/nmSEbdKCz"></iframe>
Gemini 3.1 Pro

<iframe src="https://editor.p5js.org/chengyuehan/full/BTg06M9pH"></iframe>
GPT5.4 Thinking

<iframe src="https://editor.p5js.org/chengyuehan/full/eEjDN7Zjm"></iframe>
Qwen 3 8B

While using ollama's local model, I heard my computer fan start spinning. This took more than a minute, while ChatGPT and Gemini only took a few seconds. In terms of code quality, both GPT and Gemini successfully reproduced the water flow of the fountain using only this small piece of prompting text. GPT even successfully replicated the shape of the fountain's base. In contrast, Qwen only replicated a bunch of bubbles floating upwards. 

This highlights the significant gap between cloud-based AI and on-premises AI today. While on-premises AI is superior in terms of privacy, it falls short in terms of speed and capabilities due to limitations imposed by the devices available to the average person, making it unsuitable for demanding coding tasks.

At least for today, privacy and capability remain at opposite ends of a balancing act. While cloud-based models can be configured to not use one's own data for training, compliance is largely beyond human control. Local models, on the other hand, while having all data locally and offering equally powerful performance at maximum parameters, are limited by the capabilities of human devices, restricting the number of parameters usable and making them insufficient to replace most tasks at present.

### Activity 2: Cloud AI with NotebookLM


## AI Usage Statement

*Document any use of AI tools under an AI Usage Statement heading. Explain which tools you used and describe how you used them. Reference any AI-generated content (see [QuickCite](https://auckland.libguides.com/referencing-generative-ai-tools) for guidance).*
