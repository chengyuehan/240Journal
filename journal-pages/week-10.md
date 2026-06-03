---
layout: default
---

# Week 10

[← Back to Home](../index.md)

## Documentation

## Project Development

The prototypes I designed in Claude Design last week looked the way I wanted, but they were still running on sample data rather than real model information. This week I focused on connecting them to live data. I took the demo prototype from Claude Design and gave it to Claude Code, and used it to connect the prototype to the LLM Stats API.

After this, the prototype became a real, working webpage instead of a design mockup. It now pulls live data from the API, so the prices and other values shown in the page are real and up to date rather than placeholder numbers.

![1](../assets/week-10/1.png)

I also optimised the logic of the input options this week, mainly by making them closer to everyday life. Instead of asking the user to deal with abstract amounts of input, I changed the options to relatable, real-life examples, so the input feels like something a normal person would actually do rather than a technical setting.

[![2](../assets/week-10/2.png)](../assets/week-10/github-ready/index.html)⬆️click image to see

Connecting the prototype to the API also confirmed something useful about my workflow: a design made in Claude Design could be handed over to Claude Code and actually turned into a working webpage with real data. This mattered because, until I had tested it, I was not sure the design and the implementation would fit together. Once I knew the handoff worked, I felt safe to keep investing in the design side, because I now trusted that what I designed could later be built for real. So I went back and continued to improve the gas station design.

At this point I started thinking about how to fit more dimensions into the gas station metaphor, especially the capability side of the models, not just their price and speed. So far the scene could show output price through the fuel cost and output speed through how fast the tank filled up, but capability had no place in it yet. This was the hardest dimension to include, because price and speed are both about the act of refuelling, while capability is about the model itself. The easy solution would have been to add a number, a bar, or a label somewhere on the side, but that is exactly the kind of chart-like element I had been trying to avoid since the start of the project. I did not want capability to sit outside the scene as extra data; I wanted it to come from something already inside the picture.

The idea actually came from the design itself. While I was looking at the robot Claude Design had drawn, I noticed a small circle on top of its head. At first it was just a small graphic detail, but the more I looked at it, the more it read to me like a brain, or a chip. That connection felt natural: a brain sits at the top of the head, and it is the part we associate with how clever or capable something is. So a model with a stronger brain would simply be a more capable model. I realised I did not need to invent a new element at all — this small circle that was already part of the robot could carry the capability dimension on its own.

![3](../assets/week-10/3.png)

In this way, the design from Claude gave me the inspiration I needed. It let me successfully avoid the traditional, chart-like way of showing model performance, and at the same time keep the style and the metaphor consistent across the whole demo. Capability no longer had to be a number bolted onto the side; it could live inside the same world as everything else. So I started to bring this idea into the demo.

[![2](../assets/week-10/4.png)](../assets/week-10/v1/AI%20Fuel%20Station.html)⬆️click image to see demo



## AI Usage Statement

*Document any use of AI tools under an AI Usage Statement heading. Explain which tools you used and describe how you used them. Reference any AI-generated content (see [QuickCite](https://auckland.libguides.com/referencing-generative-ai-tools) for guidance).*
