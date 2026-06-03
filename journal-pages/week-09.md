---
layout: default
---

# Week 09

[← Back to Home](../index.md)

## Documentation

## Project Statement: First Draft

### Case Study

![1](../assets/week-09/1.png)

### Drafting with NotebookLM

![2](../assets/week-09/2.png)

```
   My project is an interactive data visualization designed to surface the hidden power structures of the global **AI arms race**. We are currently witnessing a rapid, competitive escalation of model capabilities where new releases claim higher benchmarks and lower prices every few days. I imagine a **future scenario** where these models are direct symbols of geopolitical and corporate power. In this trajectory, whoever controls the most powerful model controls access to decision-making and economic opportunity, while everyday users unknowingly serve as the fuel for this competitive fire.
   
   Using live data from the **LLM Stats API**, I track model rankings, pricing, and benchmark scores to construct a comparative picture of this competition. My work engages critically with data representation by moving away from traditional, abstract charts that are often too clinical for a general audience. Instead of relying on technical metrics like "token counts"—which are often too abstract for intuitive understanding—I "**de-chart**" the information through relatable, physical metaphors. I have developed a visual system that treats AI models like competing powers, eventually evolving into a **receipt-based interface**.
   
   By transforming raw API data into a collection of digital receipts, I shift the focus from abstract numbers to the tangible results of user interaction. These receipts record model names, providers, and costs, allowing for a direct and repeatable comparison that is easy to navigate. My **intended impact** is to provide the public with information that has previously been difficult to access behind a simple chat interface. I want to move users beyond an abstract feeling of model comparison, empowering them with the autonomy to make informed choices about the tools they use—choices they may never have been invited to make before.
```

### Evaluation 

* What is working well?
Presenting data to people in an interesting way
* What is missing or underdeveloped?
No, the current level is already quite comprehensive, even excessively so.
* What feels overly generalised or AI-like?
Phrases like "AI arms race," "users as fuel," and "symbols of geopolitical power" came easily when I was writing, but they actually overreach what my project can support, and they read like filler. These grand framings end up obscuring what I'm really trying to do: let ordinary people intuitively compare and choose between models.
* What do you need to research further?
Continue upgrading my webpage to generate the latest statement.
* Write one sentence that commits to the direction of your project.
"De-charting" information through relatable, physical metaphors.


## Making Sprint

In this week, I mainly tested how to make the interaction feel more natural. In the previous prototype, there were already some basic interactions, but many parts still depended on buttons, sliders, or normal selectors. These controls are clear, but visually they feel quite rigid.

Because of this, I started thinking about whether I could use a softer and more object-based way to create interaction. My goal is not to completely avoid buttons or sliders, but I do not want them to become the main visual language of the interface. I want the user's actions to feel more connected to objects inside the page, such as fuel pumps, fuel nozzles, price boards, or receipts.

Therefore, I brought back some gas station visual elements as an interaction test. For example, model price and generation speed do not necessarily have to be controlled only through sliders or dropdown menus. They could also be represented through visual elements that feel more like part of a scene. The purpose is to make the interface feel less like a control panel and more like a visual environment that can be operated.

After confirming this idea, I tried to use Codex to continue building the demo. I explained the direction to Codex: I wanted to make the interaction less dependent on rigid buttons and sliders, and make it feel more like object-based interaction inside a gas station scene. The goal was to make the presentation of output price and output speed feel more natural.

However, this attempt with Codex did not go smoothly. It seemed to understand the general direction, but when it came to changing the webpage structure and interaction logic, the result was very weak. After many rounds of conversation and several version updates, the demo did not become closer to my idea. Instead, it doesn't quite paint the picture I want.

![3](../assets/week-09/3.gif)

This process wasted a lot of time because I kept trying to fix the problems with new prompts, but each change created new problem. Since it became too difficult to continue fixing it in Codex, I decided to stop working on this direction there for the moment.

[link to the demo](../assets/week-09/demo/index.html)

## Project Development



## AI Usage Statement

I used artificial intelligence tools to help draft and evaluate the project statement, develop self-review questions, and refine the written reflection. AI was also used for coding support during the prototype development process. I reviewed and edited the outputs to match my own project direction.

OpenAI. (2026). ChatGPT (GPT-5.4 Thinking) [Large language model]. https://chat.openai.com/chat

OpenAI. (2026). Codex (GPT-5.3 Codex) [Vibe coding agent]. https://openai.com/codex/



