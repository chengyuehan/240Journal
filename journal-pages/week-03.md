***

## layout: default

# Week 03

[← Back to Home](../index.md)

## Documentation

## In-Class Activities

### Activity 1: Explore with cURL

I found the answers to the first three questions by looking at [wttr.in's document](https://wttr.in/:help).

![1](../assets/week-03/1.png)

#### Get the weather for a location using its GPS coordinates

```terminal
curl wttr.in/12,106
```
![2](../assets/week-03/2.png)

#### Get the weather in a different languaged

```terminal
curl wttr.in/北京
```
![3](../assets/week-03/3.png)

### Get the current moon phase

```terminal
curl wttr.in/moon
```
![4](../assets/week-03/4.png)

### Look up the synonyms and antonyms of a word

```terminal
curl https://api.dictionaryapi.dev/api/v2/entries/en/cry  
```
![5](../assets/week-03/5.png)

### Find something else in the documentation that we haven't covered

```terminal
curl parrot.live
```
![6](../assets/week-03/6.gif)


Activity 2: Weather Visualisation

Open the demo sketch Links to an external site. in the p5.js web editor. This sketch uses the Open-Meteo API Links to an external site. to fetch current weather data for Auckland and map it to visual properties.

Experiment with the sketch:

Change the latitude and longitude to a different city and observe how the sketch changes.
Use the data to control different visual properties: colour, position, size, number of shapes.
Add more weather variables from the Open-Meteo documentation Links to an external site. to the API URL.
Try using random() or noise() alongside or instead of the live data.
Use vibe coding to try something more ambitious.
Use print() in the console to check the range and scale of values before trying to visualise them.

Activity 3: Design and Execute a Data Protocol

In pairs, design a data protocol: a set of rules for translating a live data source. This is the analogue equivalent of an API: a defined set of rules for requesting and receiving data.

Your protocol must specify:

Source: what live data to observe (e.g. sounds in the room, a live transport tracker on your phone)
Frequency: how often to check (e.g. every 10 seconds, every minute)
Mapping: how to record each observation as a mark, shape, or action
Write your protocol as a clear set of instructions on a sheet of paper. Someone who wasn't in your pair should be able to follow them without explanation.

Swap your protocol with another pair and follow their instructions for 10 minutes. Don't ask any clarifying questions, just interpret the rules as written.

When time is up, compare your output with what the designers intended. Did you interpret the rules as they expected? Where was the protocol ambiguous? What surprised you about the result?

## AI Usage Statement

*Document any use of AI tools under an AI Usage Statement heading. Explain which tools you used and describe how you used them. Reference any AI-generated content (see* *[QuickCite](https://auckland.libguides.com/referencing-generative-ai-tools)* *for guidance).*
