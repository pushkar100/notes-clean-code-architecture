# Functions 

## 1. Use default arguments instead of short circuiting or conditionals

Be aware that if you use them, your function will only provide default values for `undefined` arguments. Other falsy values will not be replaced as it happens while short circuiting 

```javascript
// Bad! But was a necessity before ES2015...
function setName(name) {
    const newName = name || 'Juan Palomo';
}

// Good! All the goodness of ES2015+
function setName(name = 'Juan Palomo') {
    // ...
}
```

```javascript
// Good! An example of destructuring + default values
function test({name} = {}) {
  console.log (name || 'unknown');
}
```

## 2. Reduce function arguments (2 or fewer ideally)

1. An adequate number could be 2 or less, but don't obsess over it
2. If you need to increase the arguments, use an object as an "options" parameter to group together multiple arguments. 
3. Using an **object** to grouped parameters has an added benefit in the sense that it creates a higher-level abstraction, closer to business logic

**Note:**

Three arguments should be avoided if possible (since they take a lot of time and brainpower to understand). Anything more than that should be consolidated!

**Solution:**

Create an object and pass it to the function. Use destructuring to pull out arguments in a similar fashion to multiple argumtns.

```javascript
// Bad!
function newBurger(name, price, ingredients, vegan) {
  // ...
}

// Good!
function newBurger(burger) {
  // ...
}

// Even better! Destructuring
function newBurger({ name, price, ingredients, vegan }) {
  // ...
} 

// Usage becomes easier - abstraction:
const burger = {
  name: 'Chicken',
  price: 1.25,
  ingredients: ['chicken'],
  vegan: false,
};
newBurger(burger);
```

**Alternative**

If the arguments are all of the same type, consider using the **rest** operator to clubs all of them into a single array.

For example, a list of arguments that are number to be added can be condensed using the rest operator.

```javascript
// Bad!
function add() {
  return [...arguments].reduce((a, b) => a + b, 0);
}

// Good!
function add(...args) {
  return args.reduce((a, b) => a + b, 0);
}
```

## 3. Function names should say what they do

```javascript
// Bad!
function addToDate(date, month) {
  // ...
}
const date = new Date();
// It's hard to tell from the function name what is added
addToDate(date, 1);

// Good!
function addMonthToDate(month, date) {
  // ...
}
const date = new Date();
addMonthToDate(1, date); // More readable
```

**Use verbs and keywords:**

A good example is `copyArray` which means that it is a function that copies an array.

**Verb:** A word used to describe an action, state, or occurrence, and forming the main part of the predicate of a sentence, such as _hear_, _become_, _happen_. 

Verbs are "doing" words. Verbs can express physical actions (e.g., play, dive), mental actions (e.g., think, guess), or states of being (e.g., exist, am).

**Longer names are OK**

Longer names are needed to convey all the information that we need to know. Follow the javascript convention - camelCase for variables, functions, etc and PascalCase for constructor functions and classes

## 4. Avoid side effects - Global Variables

Anything that is outside the scope of the function that is affected or utilized by it is a side-effect. Pure functions depend on input only - they don't have side-effects.

Chances of having errors in our code grows heavily as we include more side effects. However, we cannot have a side-effect free application! There will be side effects in our app because if it affects something in the enivroment then that's its purpose and also a side-effect.

Example of a side effect: Code in which a function modifies a variable or object that is outside its scope. This function cannot be tested because it has no arguments to test.

Our aim should be to reduce the side-effects, especially unintended ones.

**Caution:**

Avoid side effects at all costs to be able to generate functions that can be tested, apply techniques such as memoization and other advantages

**Solution:**

The easiest way to avoid this side effect is passing the variables that are within the scope of this function (Something obvious but not so obvious when we have to have it aimed to remember it over time) as an argument.

```javascript
// Bad!
let fruits = 'Banana Apple';
function splitFruits() {
  fruits = fruits.split(' ');
}
splitFruits();
console.log(fruits); // ['Banana', 'Apple'];

// --------------------

// Good! Send arguments
function splitFruits(fruits) {
  return fruits.split(' ');
}
const fruits = 'Banana Apple';
const newFruits = splitFruits(fruits);
console.log(fruits); // 'Banana Apple';
console.log(newFruits); // ['Banana', 'Apple'];
```

## 5. Avoid side effects - Objects Mutables

Similar to global variable changes, but when dealing with objects, be careful not to mutate them. This can occur even if they are passed as arguments and not accessed via scope

```javascript
// Bad! `cart` is mutated
const addItemToCart = (cart, item) => {
  cart.push({ item, date: Date.now() });
}; 

// Good! Avoiding mutation, keeping function pure...
const addItemToCart = (cart, item) => {
  return [
    ...cart,
    {
      item, 
      date: Date.now(),
    }
  ];
};
```

## 6. Functions should do one thing

Each function must do only one conceptual task. A set of small tasks together will make a larger task but the tasks should not be intermingled, this is known as **coupling**.

**Thumb rule to think about splitting a function:**

You should fear when you write an "if" in your code. It can be a reason to create a separate function of the conditional itself

```javascript
// Bad: We are filtering active customers, sending email, etc:
function emailCustomers(customers) {
  customers.forEach((customer) => {
    const customerRecord = database.find(customer);
    if (customerRecord.isActive()) {
      email(customer);
    }
  });
}

// ------------------

// Good! Separation of concerns
function isActiveCustomer(customer) {
  const customerRecord = database.find(customer);
  return customerRecord.isActive();
}
function emailActiveCustomers(customers) {
  customers
    .filter(isActiveCustomer)
    .forEach(email);
}
```

## 7. Functions should only be one level of abstraction

Each function should only have a single level of abstraction.

**Solution:**

Identify the different levels of abstraction and create functions that meet the requirements using the other clean coding techniques for functions listed above

When you have more than one level of abstraction your function is usually doing too much. Splitting up functions leads to reusability and easier testing.

```javascript
// Bad! tokenizer, Lexer, parser, .. all together
function parseBetterJSAlternative(code) {
  const REGEXES = [
    // ...
  ];
  const statements = code.split(' ');
  const tokens = [];
  REGEXES.forEach((REGEX) => {
    statements.forEach((statement) => {
      // ...
    });
  });
  const ast = [];
  tokens.forEach((token) => {
    // lex...
  });
  ast.forEach((node) => {
    // parse...
  });
}    

// --------------------

// Good!
const REGEXES = [ // ...];
function tokenize(code) {    
  const statements = code.split(' ');
  const tokens = [];
  REGEXES.forEach((REGEX) => {
    statements.forEach((statement) => {
      tokens.push( /* ... */ );
    });
  });
  return tokens;
}
function lexer(tokens) {
  const ast = [];
  tokens.forEach((token) => ast.push( /* */ ));
  return ast;
}
function parseBetterJSAlternative(code) {
  const tokens = tokenize(code);
  const ast = lexer(tokens);
  ast.forEach((node) => // parse...);
}
```

**Another example:**

Each function should only have one level of abstraction. This means if a function does something that has a high level of abstraction then it should only do that.

For example, if we want to write a function that loops through elements of an array and adds it to a list, then it should only do that.

Below is an example of dividing code into functions by the level of abstraction:

```javascript
// Good!
const addFruitLis = (fruits, ul) => {
  for (const f of fruits) {
    const li = document.createElement('li');
    li.innerHTML = f;
    ul.appendChild(li);
  };
}
const addFruitUl = (fruits) => {
  const ul = document.createElement('ul');
  addFruitLis(fruits, ul);
  document.body.appendChild(ul);  
}
const fruits = ['apple', 'orange', 'grape'];
addFruitUl(fruits);
```

In the code above, we have a function `addFruitLis` that create the `li` elements and append it to the `ul` element that’s in the parameter.

This is one level of abstraction because we’re adding the `li` elements after the `ul` element is generated. It’s one level below the `ul` in terms of hierarchy.

Then we defined the `addFruitUl` function to create the `ul` element and delegate the addition of `li` elements to the `addFruitLis` function. Then the `ul` is appended to the document's body. This way, each function only does as little as possible.

Each function only deals with one level of abstraction, as `addFruitLis` only deals with the li elements in the ul element and `addFruitUl` only deals with the ul element.

The wrong way to write the code above would be to combine everything into one function. It makes the function’s code complex and confusing.

## 8. Favor functional programming over imperative programming

**Advantages:**

1. Pure functions are easier to reason about
2. Testing is easier, and pure functions lend themselves well to techniques like property-based testing
3. Debugging is easier
4. Programs are more bulletproof
5. Programs are written at a higher level, and are therefore easier to comprehend
6. Function signatures are more meaningful
7. Parallel/concurrent programming is easier

Another feature of functional programming versus imperative programming is that the code is more readable

```javascript
const items = [
  {
    name: 'Coffee',
    price: 500
  }, {
    name: 'Ham',
    price: 1500
  }, {
    name: 'Bread',
    price: 150
  }, {
    name: 'Donuts',
    price: 1000
  }
];
```

```javascript
// Bad! Harder to read...
let total = 0;
for (let i = 0; i < items.length; i++) {
  total += items[i].price;
}

// Good! Easy to understand
const total = items
  .map(({ price }) => price)
  .reduce((total, price) => total + price);
```

## 9. Remove duplicate code

Do your absolute best to avoid duplicate code. Duplicate code is bad because it means that there's more than one place to alter something if you need to change some logic.

Oftentimes you have duplicate code because you have two or more slightly different things, that share a lot in common, but their differences force you to have two or more separate functions that do much of the same things. Removing duplicate code means creating an abstraction that can handle this set of different things with just one function/module/class.

**Note:**

Getting the abstraction right is critical, that's why you should follow the _SOLID_ principles laid out in the Classes section. Bad abstractions can be worse than duplicate code, so be careful!

```javascript
// Bad!
function showDeveloperList(developers) {
  developers.forEach(developer => {
    const expectedSalary = developer.calculateExpectedSalary();
    const experience = developer.getExperience();
    const githubLink = developer.getGithubLink();
    const data = {
      expectedSalary,
      experience,
      githubLink
    };

    render(data);
  });
}

function showManagerList(managers) {
  managers.forEach(manager => {
    const expectedSalary = manager.calculateExpectedSalary();
    const experience = manager.getExperience();
    const portfolio = manager.getMBAProjects();
    const data = {
      expectedSalary,
      experience,
      portfolio
    };

    render(data);
  });
}
```

```javascript
// Good!
function showEmployeeList(employees) {
  employees.forEach(employee => {
    const expectedSalary = employee.calculateExpectedSalary();
    const experience = employee.getExperience();

    const data = {
      expectedSalary,
      experience
    };

    switch (employee.type) {
      case "manager":
        data.portfolio = employee.getMBAProjects();
        break;
      case "developer":
        data.githubLink = employee.getGithubLink();
        break;
    }

    render(data);
  });
}
```

## 10. Set default objects inside functions with `Object.assign`

Instead of using short-circuiting to enable defaults for properties, use `Object.assign()`

```javascript
// Bad!
const menuConfig = {
  title: null,
  body: "Bar",
  buttonText: null,
  cancellable: true
};

function createMenu(config) {
  config.title = config.title || "Foo";
  config.body = config.body || "Bar";
  config.buttonText = config.buttonText || "Baz";
  config.cancellable =
    config.cancellable !== undefined ? config.cancellable : true;
}

createMenu(menuConfig);
```

```javascript
// Good!
const menuConfig = {
  title: "Order",
  // User did not include 'body' key
  buttonText: "Send",
  cancellable: true
};

function createMenu(config) {
  config = Object.assign(
    {
      title: "Foo",
      body: "Bar",
      buttonText: "Baz",
      cancellable: true
    },
    config
  );

  // config now equals: {title: "Order", body: "Bar", buttonText: "Send", cancellable: true}
  // ...
}

createMenu(menuConfig);
```

## 11. Use blocks in ES6 instead of IIFEs to create namespaced code

With ES6, we can create block scoped variables using `let` and `const`

```javascript
// Bad!
(function() {
  var numFruits = 1;
})();

// Good!
{
  let numFruits = 1;
};
```

Even better is to use **modules** (separate files) and code there, exporting only what you need:

```javascript
// Good!
// File: redColor.js
// Some side effect
export color = 'red'; // Main export

// File: someOtherModule.js
import { color } from './fruit'
console.log(color);
```

