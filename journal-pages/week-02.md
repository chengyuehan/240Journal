---
layout: default
---

# Week 02

[← Back to Home](../index.md)

# Documentation 
## In-Class Activities
### Activity 1: Drawing with Code
After learning some very basic p5.js drawing functions such as:

```javascript
rect()  
circle() 
fill()  
strokeWeight()  
background()  
```

I decided to directly recreate the composition shown in the PowerPoint slide. I thought this was a good starting point because the image itself was very simple, but it still helped me practise how shapes, colour, and layering work in p5.js.

![b](../assets/week-02/ex.png)
example in PPT

At the beginning, the two rectangles and the circle were very easy to make. I mainly just needed to think about the layering order. For example, the black rectangle had to be drawn first as the sky, then the circle, and then the green rectangle in front so that part of the circle would be hidden. This helped me understand that in p5.js, shapes drawn later appear on top of earlier ones.
However, after I finished the main shapes, my teacher pointed out that I also needed to think about the black line in the middle of the composition. At first I did not pay much attention to it, because I was only focused on the three main shapes. After thinking about it more, and with the teacher’s reminder, I realised that I could use `strokeWeight()` function to make the green rectangle show its outline, thus blending it with the black rectangle to create this effect.
<iframe src="https://editor.p5js.org/chengyuehan/full/3TCngiL9Z"
width="400"
height="400"></iframe>

After thinking about it more, I realised there were also other ways to create the black line in the middle. Instead of relying on the outline of the green rectangle, I could draw the line separately using `line()`. At the same time I remove the black rectangle, change the background to black colour.This made me realise that there are many different ways to achieve the same visual result. For example, I also thought about only drawing a half circle to create the same sunset effect. This helped me understand that one image can have multiple coding solutions.

<iframe src="https://editor.p5js.org/chengyuehan/full/eHpEkT5fW"
width="400"
height="400"></iframe>


Activity 2: Make an Interactive Sketch

For this activity, I created a sketch using the DOM elements introduced in class, including `createSlider()`, `createButton()`, and `createInput()`. I used three interactive controls that directly change what appears on the canvas.

The `createInput()` allows the viewer to type any text, which will then be displayed on the canvas. This makes the content of the sketch change depending on what the user enters. The `createSlider()` controls the size of the text. When the slider moves, the text becomes larger or smaller. The `createButton()` changes the colour of the text randomly each time it is pressed.

These controls allow the viewer to change both the appearance and the content of the sketch. Compared to a static drawing, this makes the visual more flexible and interactive. Through this activity, I learned how user input can be connected to variables, and how these variables can control visual elements such as size, colour, and text.

<iframe src="https://editor.p5js.org/chengyuehan/full/kR-flsQxM"
width="400"
height="400"></iframe>


！！！Use the p5.js reference Links to an external site. to try DOM elements we haven't covered, like createSelect() or createCheckbox().

Activity 3: Vibe Code an Interactive Sketch


Describe what you want in plain language.

Paste results into the p5.js editor and run the program.
Start with something simple, add features one at a time.
Ask for something you don't know how to code, and try to learn from the LLM.
Take note of what surprised you. What worked first time, what didn't, and what did you learn from reading the code?

Independent Study: Interactive Data Portrait
Overview

Take the data you collected for Experiment 1 and use it as the basis for an interactive p5.js sketch. The challenge is to translate your hand-drawn data portrait into something a viewer can explore, control, or manipulate through interactive elements.

Step 1: Translate your data drawing into code

Look at the data you collected by hand last week. How could you represent it in a p5.js sketch? Think about which values are numeric, which are categories, and which are qualitative or hard to pin down.

You don't need to represent everything. Choose aspects of your data drawing that are most interesting to make interactive.

Step 2: Design your interactive visualisation

Create a p5.js sketch that includes interactive elements that allow the viewer to explore your data. Use DOM elements (e.g. buttons, sliders, text inputs, dropdowns, checkboxes) to give the viewer control over what they encounter.

Consider:

What can interaction reveal that your hand-drawn portrait could not?
How do your controls relate to the structure of your data?
What happens when the viewer changes something? Is the response immediate, gradual, surprising?
Use the p5.js reference Links to an external site. and tutorials Links to an external site. to learn new techniques. 

Vibe coding is a legitimate creative workflow. You can use LLMs to help you build features beyond what was covered in class. Make sure to document your process and explain what you learn.

Step 3: Iterate

Test your sketch. Show it to someone else and observe how they use it. Refine the interaction based on what you observe.

Document Your Process
To capture the full scope of your practice, each entry in the Making Journal must include a mix of visual and textual evidence, such as sketches, screenshots, GIFs, diagrams, process notes, instructions and reflections.

Include reflective writing that addresses the following:

What data and visual aspects from Experiment 1 did you choose to work with, and why?
How did you decide which interactive elements to use?
What can a viewer learn by interacting with your sketch that they couldn't from your hand-drawn portrait?
Did you use vibe coding or other tools in your process? What did you learn from this?
What would you develop further with more time?
Any other reflections?

## Images & Media

*Use the format below to embed images from your assets folder:*

`![Alt text](../assets/week-01/your-image.jpg)`
`*Your caption here*`

*The text inside the square brackets is alt text (a description for accessibility), not a visible caption. To add a caption, place a line of italic text below the image.*

## AI Usage Statement

*Document any use of AI tools under an AI Usage Statement heading. Explain which tools you used and describe how you used them. Reference any AI-generated content (see [QuickCite](https://auckland.libguides.com/referencing-generative-ai-tools) for guidance).*
