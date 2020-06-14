# Detection techniques

As a general guideline, we must employ a technique called **Duck Typing** first _(default)_. If that is not sufficient for our functions, only then must we employ stricter checks.

## What is Duck Typing?

> "If it walks like a duck and it quacks like a duck then it must be a duck"

What this statement means is that we don't always have to check for specific types. Instead, we can check for specific properties, methods and other characteristics that _our code depends on (important!)_

The duck is that analogy for the type we are concerned with. It can be an object, array, etc - any type. Quacking and walking are traits (characteristics and properties) that we are concerned with.

**Why should we use duck typing?**

We must use it to improve the **FLEXIBILITY** of our code. What it means can be explained with the use of an example. Let's say that we have an array and an array-like object (such as an iterable). Let the purpose of our code be to stringify the items the input contains. In this scenario, we don't care if the input is actually an array as long as it is not null (indicating an array like interface) and items that can be iterated.

```javascript
// Bad!
const logItems = items => {
  if (!(items instanceof Array)) {
    return
  }

  for (let item of items) {
    console.log(`item: ${item}`)
  }
}

const itemsArr = ['Laptop', 'Mouse', 'Charger']

const itemsObj = {
  *[Symbol.iterator]() {
    yield 'xLaptop'
    yield 'xMouse'
    yield 'xCharger'
  }
}

logItems(itemsArr)
logItems(itemsObj)
```

```javascript
// Good!
function isIterable(obj) {
  return (
    obj != null &&
    typeof obj[Symbol.iterator] === 'function'
  )
}

const logItems = items => {
  if (!isIterable(items)) {
    return
  }

  for (let item of items) {
    console.log(`item: ${item}`)
  }
}

const itemsArr = ['Laptop', 'Mouse', 'Charger']
const itemsObj = {
  *[Symbol.iterator]() {
    yield 'xLaptop'
    yield 'xMouse'
    yield 'xCharger'
  }
}

logItems(itemsArr)
logItems(itemsObj)
```

Another example with objects:

```javascript
// Bad!
class Person {
  constructor(details) {
    this.details = details
  }
}

function getPersonDetails(person) {
  if (!(person instanceof Person)) {
    return
  }

  return person.details
}

const pushkar = new Person({ name: 'Pushkar' })
getPersonDetails(pushkar)
```

```javascript
// Good!
class Person {
  constructor(details) {
    this.details = details
  }
}

function getPersonDetails(person) {
  if (!(person || person.details)) {
    return
  }

  return person.details
}

const pushkar = new Person({ name: 'Pushkar' })
getPersonDetails(pushkar)
```

Another example would be duck typing that includes the DOM lists that are array-like objects.

## Using stricter checks when duck typing is insufficient

If you really need stricter checks i.e An array must be of type Array and so on, you may use the following techniques:

1. Booleans: `typeof value` and `value === true` or `value === false`
2. Numbers: `typeof value` and `Number.isNaN(value)` or `Number.isFinite(value)` for `NaN` and bounds (If you want to implicitly typecast the value being checked, use the global `isNaN` and `isFinite`)
3. Strings: `typeof value` and `value.length` for non-empty string (i.e Disallow `''`)
4. undefined: `typeof value === "undefined"` or the less understood `value === void 0` (local undefined can be modified but the global cannot; `void` will always return `undefined` though)
5. null: `value === null`
6. null or undefined: `value === null || typeof value === "undefined"` or if we are sure that `undefined` has not been modified then `value === null || value === undefined`
7. Arrays: `Array.isArray(value)`
8. Instances: `value instanceof SomeInstance`
9. Plain objects: `Object.getPrototypeOf(value) === Object.prototype`