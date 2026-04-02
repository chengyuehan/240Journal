---
layout: default
---

# Week 04

[← Back to Home](../index.md)

## Documentation 

## In-Class Activities

### Activity 1: Local AI with Ollama

In this activity, I chose to use qwen3 8b as the local model. I tried having them write some p5.js code and then comparing their code with online AI.

```Prompt
create a flowing fountain using p5.js.
```
<iframe src="https://editor.p5js.org/chengyuehan/full/nmSEbdKCz"
width="400"
height="400"></iframe>
Gemini 3.1 Pro

<iframe src="https://editor.p5js.org/chengyuehan/full/BTg06M9pH"
width="400"
height="400"></iframe>
GPT5.4 Thinking

<iframe src="https://editor.p5js.org/chengyuehan/full/eEjDN7Zjm"></iframe>
Qwen 3 8B

While using ollama's local model, I heard my computer fan start spinning. This took more than a minute, while ChatGPT and Gemini only took a few seconds. In terms of code quality, both GPT and Gemini successfully reproduced the water flow of the fountain using only this small piece of prompting text. GPT even successfully replicated the shape of the fountain's base. In contrast, Qwen only replicated a bunch of bubbles floating upwards. 

This highlights the significant gap between cloud-based AI and on-premises AI today. While on-premises AI is superior in terms of privacy, it falls short in terms of speed and capabilities due to limitations imposed by the devices available to the average person, making it unsuitable for demanding coding tasks.

At least for today, privacy and capability remain at opposite ends of a balancing act. While cloud-based models can be configured to not use one's own data for training, compliance is largely beyond human control. Local models, on the other hand, while having all data locally and offering equally powerful performance at maximum parameters, are limited by the capabilities of human devices, restricting the number of parameters usable and making them insufficient to replace most tasks at present.

### Activity 2: Cloud AI with NotebookLM

For this activity, I used NotebookLM to gather together the sources that reflect my experimentation so far in this course. I added my Making Journal, several external references that influenced my thinking, and a short context document to guide the AI. 

![1](../assets/week-04/1.png)

NotebookLM's automatic question recommendation feature revealed many possibilities and content I hadn't discovered before. By analyzing all my files, it automatically suggested several questions I might be interested in, such as how to break free from the limitations of "data analysis thinking" and make data visualization more creative and human-centered. It not only summarized useful information from each source but also provided many helpful suggestions. I could also engage in deeper Q&A sessions with the responses, gaining a better understanding of my interests and concerns from different perspectives.

## Independent Study: AI-Assisted Data Exploration

### Step 1: Find a Dataset

I chose the [New Zealand Driver's License Holding Rate dataset](https://catalogue.data.govt.nz/dataset/rates-of-driver-licence-holding-in-aotearoa-nz) because it is closely related to the daily lives of New Zealanders. Driver's license ownership affects people's opportunities for employment, education, healthcare, and social interaction, especially in areas with limited public transport access. I am interested in this dataset because it allows us to view the driver's license issue not only as a transportation problem, but also as a social and spatial one.

### Step 2: Understand the Data

After speaking with Claude, I gained a much better understanding of the data. It's a very complete and well-organized percentage-based dataset, without a large amount of inconsistently formatted data that requires cleaning and processing. The data shows the number and proportion of people with driver's licenses under different segmentation criteria, such as ethnicity and age.

Through this data, I discovered many things that were both intuitive and counterintuitive. For example, full-time employees had the highest licensing rate, but part-time employees (67%) had a lower licensing rate than those "outside the labor market" (68%).

This dataset was created by linking driver's license registers to census records. Its core purpose was administrative and policy monitoring—to understand who still lacks a driver's license. This very purpose introduces a bias: the data only asks "who has a driver's license or doesn't have one," never "why they don't have one" or "what does not having a driver's license actually mean for their lives." It reflects a systemic perspective, not a human one.

### Step 3: Design Multiple Representations

Of all the categories, I chose the one that interested me most: categorized by education level. I had Claude generate a visualization, which, after analysis by pands, returned an HTML document[to visualization](../assets/week-04/qual_viz.html)← click to see

The results returned by Claude showed me that there were two different sets of data: one containing only education level and the other containing both education level and age. Therefore, I plan to create three separate visualization: one for those with only academic qualifications, one for those with both academic qualifications and age, and one where age can be viewed in a sub-menu of the academic qualifications table.

#### 1
![2](../assets/week-04/2.png)
[click to see](../assets/week-04/qual_characters.html)

Claude created a webpage featuring four different people, each representing a different level of education. However, regarding the data presentation, I advised against using tables and charts, but he still opted for a design resembling an energy bar, which perhaps lacked imagination. I was very satisfied with his automatically generated "Who's behind the wheel?" theme; this description effectively illustrated the meaning of the visualization: using education level to reveal the percentage of people holding driver's licenses, thereby uncovering those who have been overlooked.

### 2 

<iframe src="https://editor.p5js.org/chengyuehan/full/uzJtfXmRg"
width="1200"
height="700"></iframe>

In this iteration, I instructed ChatGPT to try to move away from traditional chart formats and organize the data in a more visually metaphorical way. Instead of directly creating bar charts or line graphs, I transformed the data for different groups into an organic, flower-like form. Each flower represents an age or education level group, the four petals correspond to different driver's license statuses, and the length of the petals and the overall size represent proportions and numbers. The goal was to make the otherwise rigid statistical data more lifelike and to allow viewers to not just "read" the data, but to first visually experience the differences between different groups.

### 3 


Step 4: Critically Evaluate

Look at the representations you've produced and reflect on the AI's design choices:

What did the AI default to? (e.g. bar charts, blue colour schemes, generic titles)
What did you have to override or redirect?
What assumptions did the AI make about the data or the audience?
Which representation is the most interesting, and why?
What would you do differently if you were building this without AI?

Document Your Process
To capture the full scope of your practice, each entry in the Making Journal must include a mix of visual and textual evidence, such as sketches, screenshots, GIFs, diagrams, process notes, instructions and reflections.

Items on the course Reading List for this week include the introduction to Data Feminism by Catherine D'Ignazio and Lauren F. Klein, and a talk by Kirikowhai Mikaere on Māori data sovereignty. Engage with both of these and draw on them in your reflections.

Include reflective writing that addresses the following:

What dataset did you choose, and why?
How did AI tools help you understand the data? What did they miss?
What design decisions did you make in directing the AI, and what did you learn from this process?
How do the different representations of the same data change what a viewer might understand?
What questions do D'Ignazio and Klein's ideas raise for your work with this dataset?
How does Mikaere's framing of data as a strategic asset for Māori development challenge or inform how you think about the dataset you chose?
What was your experience of working with AI as design tool?
What would you develop further with more time?
Any other reflections?

## AI Usage Statement

*Document any use of AI tools under an AI Usage Statement heading. Explain which tools you used and describe how you used them. Reference any AI-generated content (see [QuickCite](https://auckland.libguides.com/referencing-generative-ai-tools) for guidance).*
