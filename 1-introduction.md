# Introduction

Learn some core concepts of clean code.

[Link to series of articles](https://dev.to/carlillo/clean-code-applied-to-javascript-part-i-before-your-start-16ic)

[Link to Ryan's repo](https://github.com/ryanmcdermott/clean-code-javascript)

[Jecelyn Yeen on Scotch.io](https://scotch.io/tutorials/5-tips-to-write-better-conditionals-in-javascript#toc-1-use-array-includes-for-multiple-criteria)

[Level Up Medium articles by John Au Yeung](https://levelup.gitconnected.com/@hohanga)

[FreeCodeCamp on Youtube - Clean Code (Beau Teaches Javascript)](https://www.youtube.com/playlist?list=PLWKjhJtqVAbkK24EaPurzMq0-kw5U9pJh)

[Clean Code in Javascript](https://github.com/PacktPublishing/Clean-Code-in-JavaScript)

## What is Clean Code?

Code that is **Readable**, **Reusable**, and **Refactorable**

When we write code, we are defining an implicit specification. This specification is communicated by its name, its configuration, its options, its input, and its output. Anyone who uses our code has the right to expect it to work according to its specifications, so the more explicit.

## Writing code for humans

The code we write is primarily for people. You may be building a brochure website, programming a web application, or crafting a complex utility function for a framework.

Your end user with a GUI you built, or other programmers using your code, and even your future self - all of them are people.

When we say that we are writing code for humans, what do we mean? We mean:

1. **There is clarity of intent**. We don't just focus on _functionality_ like when we write for machines.

```javascript
// Bad!
function chb(d,m,y) {
  return new Date(y,m-1,d)-new Date / 6e4 * 70;
}

// Good!
const AVG_HEART_RATE_PER_MILLISECOND = 70 / 60000;

function calculateHeartBeatsSinceBirth(birthDay, birthMonth, birthYear) {
  const birthMonthIndex = birthMonth - 1;
  const birthDate = new Date(birthYear, birthMonthIndex, birthDay);
  const currentDate = new Date();

  return (currentDate - birthDate) / AVG_HEART_RATE_PER_MILLISECOND;
}
```

2. **Readability of code**

The more cognitive effort required to read the code, the less it is appreciated. The purpose, when you are presenting your code to another programmer, is **"comprehension"**

Therefore, maintain good _patterns_ and _formatting_ - people are good at spotting inconsistencies!

**Keywords**: Comprehension, presentation, patterns, formatting, consistency

3. **Meaningful abstraction**

What is abstraction? Abstraction is what occurs when we take a piece of complexity and then present access to that complexity in a simpler way.

Why is it important? It enables people to have leverage (advantage or influence or power used to achieve a desired result) over that abstracted complexity without having to understand it. Ex: Calling `startAnimation()` abstracts away all the internals of the animation and enables the user of this code to achieve what he wants with the code - i.e start the animation - without knowing the implementation details

Examples of in-built abstractions:
- Javascript abstracts away memory allocation complexity from us
- Browser abstracts away HTTP communication, local storage, and HTML DOM & CSSOM creation & Rendering details
- NodeJS abstracts away file system, path, etc. modules

In the same way, every line of code you write introduces some level of abstraction

**Tower of abstraction:**

Every type of software written has added on layer on the "tower of abstraction" (an analogy). The higher a layer, the more it depends on all the lower code - so the lower code needs to be very reliable! We have to think about this when writing our code

Ex: 
- Our application
- Framework
- Browser
- Operating system
- Machine language 
- hardware

## What is a "Code Smell"?

> A code smell is a surface indication that usually corresponds
> to a deeper problem in the system (Martin Fowler)

> Bad code smells can be an indicator of factors 
> that contribute to technical debt (Robert C  Martin)

## What is "Technical Debt"?

> Technical debt is a concept in software development that reflects 
> the implied cost of additional rework caused by choosing an easy 
> solution now instead of using a better approach that would take longer.

## What is "Code Refactoring"?

> Code refactoring is the process of restructuring existing computer code without changing its external behavior.

Refactoring is no Silver Bullet but it is a valuable weapon which benefit you to keep excellent hold on your code & so the project (software/application).

It is a scientific process of taking existing code and improves it while it makes code more readable, understandable, and clean. Also, it becomes very handy to add new features, build large applications and spot & fix bugs.

**Benefits of code refactoring**

1. Improves the design of software/application.
2. Improved code readability and reduced complexity (easier to understand)
3. Improved source-code maintainability (fix existing legacy database)
4. Easier to find bugs
5. Creates a more expressive internal architecture to improve extensibility
6. Provides greater consistency for user

## Recommendations for clean code

1. Code must be **Human Readable**

Do not think about how it will be processed by the computer because there will be many tools that will transform our code (transpilators). Therefore, the most important thing is that the code will be readable by humans because the longest of your work when you are developing code will be reading code instead of writing it.

```javascript
// Not very readable:
var users = [{id: 1, name: "Pushkar", age: 26}, {id: 2, name: "Rahul", age: 30}, {id: 3, name: "Arpita", age: 19}]

// More readable:
var users = [
  {
    id: 1, 
    name: "Pushkar", 
    age: 26
  }, 
  {
    id: 2, 
    name: "Rahul", 
    age: 30
  },
  {
    id: 3, 
    name: "Arpita", 
    age: 19
  }
]
```

2. Write code in **English**

Imagine reading code in a language that you will not be able to know the variables or function’s name, all the code will be encrypted for you.

Plain English letters and digits aren’t encoded in any special way, so it won’t cause problems in different systems and we can easily search for the names. Also, most languages have English keywords so it’s more consistent with the rest of the code

It justs taxes people’s brains more to figure out the encoding of characters of different languages. That’s the time that can be used to read and code

3. Coding involves **Teamwork**

Today nobody develops software alone. Everyone has a certain style preference. We can normalize the code by using linters and code formatters that perform these tasks while pushing or committing code.

You have to get to the point where the whole project seems programmed by a single person instead of seeing the different customs of the different members of the development team.