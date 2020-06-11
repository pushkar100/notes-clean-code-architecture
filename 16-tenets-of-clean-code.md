# Tenets of clean code

1. Reliability 
  1. Correctness
  2. Stability
  3. Resilience
2. Efficiency 
  1. Time
  2. Space
3. Maintainability 
  1. Adaptability
  2. Familiarity
4. Usability
  - User stories, intuitive design, accessibility, ...

A good software is said to have all these qualities. Bad software has none of these.

## Reliability

Reliability is the quality of being correct, stable, and resilient. Often, we can achieve the highest level of reliability by using existing tried-and-tested open source libraries and utilities.

### Correctness

Code that is correct is code which conforms to a set of expectations and requirements.

**An example:**

A valid email checker function. For that we need to know the expectation and the requirements must be absolutely correct (no ambiguity) since there are many types of emails that are valid but we require only the common ones for the purpose of, say, web authentication.

**How do we check correctness?**

Through testing.

### Stability

Stability is about the continued correct behavior given different valid inputs and situations.
Without stability, things get precarious; we become unsure of whether things will break at any moment.

**An example:**

A web application when used in a mobile view or just a different resolution does not render correctly. This is a perfectly valid usage but the system is not stable!

**How do we check correctness?**

Again, testing all possible types of inputs and situations.

### Resilience

Resilience is about avoiding failure. Also known as *fault tolerance* or *redundancy*.

Resilience concerns itself with what happens when your code is exposed to unexpected or nonroutine inputs.

One (good) way to provide resilience is to have **"Graceful Degradation"**. Graceful degradation is your application degrading to a state in which they can still be used.

**A real world example:**

An escalator runs on power but if the electricity were to be cut off for it, it stops and is still usable because it is now like other, normal stairs that can be climbed by the user.

**Coding examples:**

- If web apis to watch a video are not supported, provide the user with a transcript instead
- If performance api is not supported to display time measurements, display it using date api with a message saying accurate measurement is not supported on the platform.

**Why is resilience important?**

If we think about resilience, we force ourselves to think about unexpected failure cases and accomodating them thereby increasing usability and stability.

**Resilience vs Correctness and Stability:**

While correctness and stability deal with expect inputs and the full range of it, resilience concerns itself with unexpected inputs and situations.

**Note:** Feature detection alone is not graceful degradation. For example, if we do nothing when video does not play, it is not very useful for the user.

## Efficiency

Resources are finite i.e scarce and they must be used with caution

Two scarcities: _Time_ and _Space_. Optimizing these two has knock-on effects - improving other things such as metrics, power usage, and user experience.

### Time

Accomodate the end user's time. Optimize the amount of CPU cycles, or time, spent on any task.

**An example**

```javascript
// Bad! Removing duplicates
const final = []
for (let i = 0; i < current.length; i++) { // linear (n)
  if (current.indexOf(current[i], i + 1)) { // linear search (n): unnecessary
    final.push(current[i])
  }
}

// Good! Removing duplicates
const map = new Map()
const final = []
for (let i = 0; i < current.length; i++) { // Only one linear scan (n)
  if (map.get(current[i])) {
    continue;
  } else {
    map.set(current[i], true)
    final.push(current[i])
  }
}
```

**Caution**

Do _not_ **micro-optimize**! That is, focus on the larger aspects of performance instead of micro or millisecond advantages. The modern JS compilers are smart enough to do those things for you!

```javascript
for (let i = 0, len = arr.length; i < len; i++) { // Caching length - not recalculating it every scan
  // Caching is such a small advantage in terms of time
  // It does not affect user if you check length every scan as it is a small operation
  // The modern compiler will cache it for you even if you dont!
  // code
}
```

**How to avoid micro-optimizations?**

Think of the user. Perform an audit and make a note of the biggest user problems - can be based on metrics, complaints, etc.

### Space

Another scarcity. RAM, Persistent storage, etc.

Javascript is high level and does not really give you memory allocation APIs. However, we deal a lot with network calls, especially on the browser.

We must reduce the network bandwidth of the user consumed, decrease latency to improve the experience and so on. Ship less data and code - as complexity grows this becomes important. This frugal use of space has an affect on time as well

**How do we measure it?**

- Time to interactive
- Time to first paint (Other variations such as Time to first meaningful paint and so on)

## Maintainability

Coding is teamwork! There is _shared responsibility_. One of the main aspects of maintainability is **Comprehensibility** - The users must understand our code first, before they can even make changes.

**Who are the users of your code?**

Not just the end **users** but also **other programmers** (colleagues, other teams, client team, etc) who read, use, modify and extend the code that you have written. When you are thinking about users, always think about at least these two kinds!

### Adaptability

Adaptability refers to the ability of your code to cater to and adapt to different needs and environments. 

**The caveat!** 

The code cannot be infinitely adaptive. The very nature of code is that it is made for a specific purpose; to solve a specific problem for the user. 

We can and should provide a level of configuration in our code, allowing for varying needs, but we cannot foresee all possibilities.

For example, while building a carousel you may expose many API methods (fade in, numImages, loop?, etc) but if someone comes up with a request for a new method - there is not much you can do (cannot always incorporate it without mondification of code itself).

**Characteristics harmful to adaptibility**

1. **Fragility**: If one area of code is changed to make a bug fix or add a feature, and it affects several seemingly unrelated things in a different part of the code base
2. **Rigidity**: If one behavior needs to be changed, ideally, we should only have to make that change in one place. But if we have to rewrite code all over the place just to accomplish that one change, then we can say the code is rigid.

**How can we make our code more adaptable?**

**Modularity!** It refers to "separation of code" - reduce coupling or intertwining of code. It can be achieved by following **SOLID principles**!

### Familiarity

It's a feeling of comfort where you know what's happening because you've seen it before.

**Real world analogy**

A mechanic works on many different cars. When he inspects one though, he expects to find the components in the usual places. It is the familiarity of the system that gives him the confidence to work on the car.

**Familiarity in code**

The question to be asked is, _"Would another programmer working within another industry be able to understand this with little introduction?_

- Don't stray too far from common design patterns
- Be consistent with syntax and presentation 
- Lend clarity to unfamiliar problem domains

## Usability

Usability is about making our code, and the functions and interactions it enables, as useful and easy to use as possible for the full gamut of users. It is about users achieving goals with minimum hassle, time, and cognitive effort.

```javascript
// Bad!
function checkIsNewYear(
  configuration,
  filter,
  formatter,
  MDY,
  SMH
) {...}
```

- What is configuration?
- Presumably, SMH is seconds, minutes, and hours, but what kind of value is it expected to be? An object? Similarly for MDY
- Why are there filter and formatter arguments and what do they do? Are they optional?
- What does the function return? A Boolean? The formatter argument would suggest not. 
- Why can't I just pass a date object instead of individual date components?

**How can we improve usability?**

1. **User stories**: `As a {persona}, I want to {want}, so that {purpose}...`
  - Ex: `As a user, I want to add a new contact so that I can later recall that contact from my contacts list.` 
2. **Intuitive design**: All users are attuned to a set of patterns that are employed on their level of abstraction.
3. **Accessibility**: Not just physically challenged persons but even ones with less access to technology due to mobility, economy, or infrastructure. We must focus on the user when things seem complex