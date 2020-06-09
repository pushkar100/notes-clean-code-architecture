# Introduction

Learn some core concepts of clean code.

[Link to series of articles](https://dev.to/carlillo/clean-code-applied-to-javascript-part-i-before-your-start-16ic)

[Link to Ryan's repo](https://github.com/ryanmcdermott/clean-code-javascript)

[Jecelyn Yeen on Scotch.io](https://scotch.io/tutorials/5-tips-to-write-better-conditionals-in-javascript#toc-1-use-array-includes-for-multiple-criteria)

[Level Up Medium articles by John Au Yeung](https://levelup.gitconnected.com/@hohanga)

[FreeCodeCamp on Youtube - Clean Code (Beau Teaches Javascript)](https://www.youtube.com/playlist?list=PLWKjhJtqVAbkK24EaPurzMq0-kw5U9pJh)

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