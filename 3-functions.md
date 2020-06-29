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

## 12. Returning early as a way to remove conditional complexity

Returning is not only useful for shifting control from one function to another. By **returning early** we are using its side-effect which is avoiding work that exists on lines below itself

```javascript 
// Bad!
function isDancer(person) {
  if (person) {
    if (person.hasMoves && person.hasMoves.length) {
      if (person.hasMoves.type === 'DANCE') {
        return true
      } else {
        return false
      }
    }
  } else {
    return false;
  }
}
```

By employing pre-emptive input checks, we are reducing the complexity and the congitive burden on the user. Hence, readabilty is improved too! 

```javascript 
// Good!
function isDancer(person) {
  if (!person || !(person.hasMoves && person.hasMoves.length)) {
    return false
  }

  if (person.hasMoves.type === 'DANCE') {
    return true
  }

  return false
}
```

```javascript 
// Even better!
function isDancer(person) {
  if (hasNoValidMoves(person)) {
    return false
  }

  if (isMoveTypeDance(person.hasMoves.type)) {
    return true
  }

  return false
}

function hasNoValidMoves(person) {
  const { hasMoves } = person || {}
  return !(hasMoves && hasMoves.length)
}

function isMoveTypeDance(type) {
  const DANCE_MOVE_TYPE = 'DANCE'
  return type === DANCE_MOVE_TYPE
}
```

## 13. If dealing primarily with switch cases, return directly from each case

It reduces the cognitive load on the user by removing the need to process what is below the switch case or below the switch construct itself. Improves readability.

```javascript
// Good!
function generateWelcomeMessage(language) {
  let message;

  switch (language) {
    case 'DE':
      message = 'Willkommen!';
    case 'FR':
      message = 'Bienvenue!';
    default:
      message = 'Welcome!';
  }

  return message;
}
```

```javascript
// Good!
function generateWelcomeMessage(language) {
  switch (language) {
    case 'DE':
      return 'Willkommen!';
    case 'FR':
      return 'Bienvenue!';
    default:
      return 'Welcome!';
  }
}
```

## 14. Do not invoke functions using `bind()`, `call()`, or `apply` unless dealing with low-level code

The most readable, simple and easily understood method of invocation is the humble parentheses `()` which does not intentionally manipulate the `this` value. Ex: `someFunction()`

**Use cases for `bind()`, `apply()`, or `call()`:**

- Low level libraries consumed by others (Ex: DOM manipulation, logging tools, etc - you decide)
- Utility functions that are used by other higher order code (such as react component code)

**One reason why usage of `bind()` is frowned upon in React class components**

There are many reason but the foundation for all those reasons is that `bind()` is a low level implementation specific code. React components, however, are already meant to be high level - with the low level aspects of it such as the reconciliation, DOM manipulation, etc already abstracted by `react` and `react-dom` libraries themselves. So, why should I, as consumer of react, deal with the low level complexities? (**Note**: Hooks solve this problem)

**A. Partial applications are a good reason to use them** 

A great use case for bind is Partial Applications of functions. (i.e. giving a function only some of it’s arguments).

```javascript
// Good!
function list(...args) {
  return [...args]
}

function addArguments(arg1, arg2) {
  return arg1 + arg2
}

const list1 = list(1, 2, 3);
//  [1, 2, 3]

const result1 = addArguments(1, 2);
//  3

// Create a function with a preset leading argument
const leadingThirtysevenList = list.bind(null, 37);

// Create a function with a preset first argument.
const addThirtySeven = addArguments.bind(null, 37); 

const list2 = leadingThirtysevenList(); 
//  [37]

const list3 = leadingThirtysevenList(1, 2, 3); 
//  [37, 1, 2, 3]

const result2 = addThirtySeven(5); 
//  37 + 5 = 42 

const result3 = addThirtySeven(5, 10);
//  37 + 5 = 42 
//  (the second argument is ignored)
```

**A. Async stuff when you want to control `this` when function is invoked is another use-case** 

For example, in React we bind our async callbacks that are sent to events as callback (Ex: Form `onSubmit` event). As much as it is frowned upon from a design perspective, for the component to work as expected, it is a necessity to bind the function that will be executed async. Therefore, apart from the debates on the library's design, for a consumer of it, it is a perfectly valid scenario to use `bind` for this purpose

## 15. Function declarations vs Expressions vs Arrow Functions

There are many ways to declare a function. The following tips can help you decide which one to use.

1. **Use arrow function for traditional lambda methods (Pure functions)**

For callbacks or handlers not manipulating `this`, use arrow functions. A good example would be inside functional programming style methods such as array built-ins: `filter`, `map`, `reduce`, etc.

```javascript
// Good!
const hasId = item => item.id !== undefined
const renderItem = ({ name, id}) => `${id}: ${name}`

function getMarkupForItemsWithIds(items) {
  return items
    .filter(hasId)
    .map(renderItem)
}
```

The above code is clean because the _readability_ has increased with arrow functions. It is a very _succinct_ syntax.

2. **Use arrow function for promise chains**

It is a callback and does not get invoked with any particular `this`. Therefore, it is the perfect place to use arrow functions. 

The reasons are same: Readability and succinctness. If we receive a state and return is a manipulation of that, arrow functions make it even more readable

```javascript
// Good!
someAPIPromise
  .then(response => dispatch({
    type: API_RESPONSE,
    payload: response.data
  }))
  .catch(error => {
    throw new ApiError(error)
  })
```

3. **Use arrow function for object transformations**

```javascript
// Good!
export default {
  computed: {
    ...mapState({
      results: state => state.results,
      users: state => state.users,
    });
  }
}
```

4. **Use function expressions where `this` is dynamic (a.k.a Do not use arrow functions)**

Limitations of arrow functions:

- It does not provide access to bindings such as `this` or `arguments`

```javascript
// Bad! Will give unexpected results
class Counter {
  // Using the class-properties proposal 
  // Not valid syntax without the babel plugin for it:
  counter = 0;

  handleClick = () => {
    this.counter++;
  }

  constructor() {
    // Binding is useless!! The following line does not work!
    this.handleClick = this.handleClick.bind(this);
  }
}
```

```javascript
// Good!
class Counter {
  counter = 0;

  handleClick() {
    this.counter++;
  }

  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }
}
```

- It does not have a prototype property, so it cannot be used as a constructor. Therefore, it is not a good idea to use it as a `class`, `object`, or `prototype` method!

```javascript
class FooBear {
  name = 'Foo Bear';
}
```

```javascript
// Bad!
FooBear.prototype.sayHello = () => `Hello I am ${this.name}`

new FooBear().sayHello() // "Hello I am "
```

```javascript
// Good
FooBear.prototype.sayHello = function() {
  return `Hello I am ${this.name}`;
};
new FooBear().sayHello() // "Hello I am Foo Bear" 

// Same logic applies to object and class methods!
```

An object method example:

```javascript
// Bad!
const calculate = {  
  array: [1, 2, 3],
  sum: () => {
    console.log(this === window); // => true
    return this.array.reduce((result, item) => result + item);
  }
};
console.log(this === window); // => true
// Throws "TypeError: Cannot read property 'reduce' of undefined"
calculate.sum();
```

```javascript
// Good!
const calculate = {  
  array: [1, 2, 3],
  sum: function() { // Or `sum() {` which is the same thing!
    console.log(this === window); // => false
    return this.array.reduce((result, item) => result + item);
  }
};
console.log(this === window); // => true
calculate.sum(); // 6
```

A constructor example:

```javascript
// Bad!
const MyCat = name => {
  this.catName = name;
}

new MyCat('Alex').catName // Uncaught TypeError: MyCat is not a constructor
```

```javascript
// Good!
// In the case of constructors, it is more common to use a fn. declaration!
function MyCat(name) {
  this.catName = name;
}

new MyCat('Alex').catName // Alex
```

5. **Do not rely on hoisting when using function declarations**

_Hoisting_ is not intuitive. As a JS developer, we are expected to know the concept but while reading through code, it takes more mental effort to map a function declared somewhere downstream in the scope to its usage much earlier in the same scope.

```javascript
// Bad!
someFunction()

// ... 
// other things
// ...

function someFunction() {}
```

```javascript
// Good!
function someFunction() {}

// ... 
// other things
// ...

someFunction()
```

6. **Caution: Do not let arrow functions obscure the code too much**

Arrow functions make everything succinct but too much of it can lead to loss of readability. Only the right amount makes it readable.

```javascript
// Bad!
const multiply = (a, b) => b === undefined ? b => a * b : a * b;
const double = multiply(2);
double(3);      // => 6
multiply(2, 3); // => 6
```

```javascript
// Good!
// Using arrow functions but with clarity:
const multiply = (a, b) => {
  if (b === undefined) {
    return b => a * b
  }
  
  return a * b;
}
const double = multiply(2);
double(3);      // => 6
multiply(2, 3); // => 6
```

## 16. Cleaner parameters with default args, destructuring, and rest params

The usage of the 3 techniques gives us very **predictable** code

**Default arguments**

- They help give placeholder values whenever the actual value is missing
- The placeholder value gives a hint on what data type is expected

```javascript
// Bad!
function convertCurrency = (value, conversionRate) => {
  conversionRate = conversionRate || 1
  return value * conversionRate
}
convertCurrency(100) // 100
```

```javascript
// Good!
function convertCurrency = (value, conversionRate = 1) => {
  return value * conversionRate
}
convertCurrency(100) // 100
```

**Destructuring**

- Destructuring can happen inside function arguments' list or outside it
    - If it happens inside arguments, it is better for readability & preditable code
- Can use a single object param instead of an ever-growing list of arguments (order does not matter)
- Can assign key to variable of the same name
- Can also assign key to variable of a different name
- Can destructure arrays as well (but the order matters)

```javascript
// Bad!
function saveCityAndState(location) {
  const latitude = location.latitude
  const longitude = location.longitude
  // ...
}
```

```javascript
// Good!
function saveCityAndState({ latitude, longitude }) {
  // ...
}
```

```javascript
// Good!
// Default values (as Bengaluru coordinates) within a destructure
function saveCityAndState({ latitude = 12.97, longitude = 77.59 }) {
  // ...
}
```

```javascript
// Good!
// Renaming destructured values
function saveCityAndState({ lat: latitude, long: longitude }) {
  long // Error - not available
  longitude // Accessible ☑
  // ...
}
```

The major benefit of objects as parameters is that we can have **extensible** functions:

```javascript
// Bad!
function foo(param1, param2, param3) {

}

// If 2nd argument is not passed, it needs to 
// have undefined as placeholder
foo(param1, undefined, param3)
```

```javascript
// Good!
function foo(param1, options) {
  const { param2, param3 } = options
}
```

**Rest parameters**

- It is useful when we have _**an unknown number of similar arguments**_
- We do not have to force consumer of code to pass in an array!
- It is a great way to pass props if you do not plan on altering them (If you do, use objects and the destructuring approach)

_The rest operator has to be the last argument!_

```javascript
// Bad!
// Cannot even extend the function without modifying it
function validateCharacterCount(max, item1, item2, item3) {
  if (item1.length > max) { return false }
  if (item2.length > max) { return false }
  if (item2.length > max) { return false }
  return true
}
validateCharacterCount(5, "sugar", "watermelon", "fig", /* Not even considered -> */ "apple")

// Also bad but better!
// Forcing consumer to send an array of similar params
// instead of appending them to the list
function validateCharacterCount(max, itemsList) {
  return itemsList.every(item => item.length < max)
}
validateCharacterCount(5, ["sugar", "watermelon", "fig"])
```

```javascript
// Good!
function validateCharacterCount(max, ...items) {
  return items.every(item => item.length < max)
}
validateCharacterCount(5, "sugar", "watermelon", "fig")
// If consumer has a list already, they can "spread" it out:
const fruitList = ["mango", "watermelon", "fig"]
validateCharacterCount(5, ...fruitList)
```

**Note:** 

We can use rest parameters inside object and array destructuring to get the remaining key/values as a separate object:

```javascript
// Bad!
function savePhotoLocationData(photo) {}
```

```javascript
// Good!
function savePhotoLocationData({ 
  coordinates,
  city,
  state,
  ...additionalData
}) {
  // Additional data can be used if required
  // It will not contain coordinates, city, state
}
```