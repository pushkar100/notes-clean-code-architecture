# Conditionals & Loops

**Avoid Conditional Complexity**

Conditional complexity causes code to be more complicated to understand and therefore harder to maintain

## 1. Don’t use flags as function parameters

The first advice to avoid complexity is to eliminate flags as parameters of a function. Flags tell your user that this function does more than one thing. Functions should do one thing. Split out your functions if they are following different code paths based on a boolean.

Instead, we must create two functions that implement the logic of our problem, instead of using a single function in which we have the logic of the two functionalities since they are different

_Boolean parameters should be used sparingly. It makes the function signature more complex and it tells us that the function does more than one thing (has multiple paths)._

```javascript
// Bad!
function book(customer, isPremium) {
  // ...
  if (isPremium) {
    premiumLogic();
  } else {
    regularLogic();
  }
}

// ---------------

// Good! Clean (Declarative way)
function bookPremium (customer) {
  premiumLogic();
}

function bookRegular (customer) {
  retularLogic();
}
```

## 2. Encapsulate Conditionals (into a separate function)

Don’t make me think! Please encapsulate the conditions in a function that has semantic value

```javascript
// Bad!
if (platform.state === 'fetching' && isEmpty(cart)) {
  // ...
}

// Good!
function showLoading(platform, cart) {
  return platform.state === 'fetching' && isEmpty(cart);
}

if (showLoading(platform, cart)) {
  // ...
}
```

## 3. Replace nested conditional with Guard Clauses

You should **not** have nested conditionals. One of the main techniques that allow us to avoid nested conditionals is the **Guard Clauses** technique. 

Imagine developing without needing the `else` keyword

```javascript
// Bad!
function getPayAmount() {
  let result;
  if (isDead){
    result = deadAmount();
  } else {
    if (isSeparated){
      result = separatedAmount();
    } else {
      if (isRetired){
        result = retiredAmount();
      } else{
        result = normalPayAmount();
      }
    }
  }
  return result;
}
```

```javascript
// Good! Guard clauses
function getPayAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

**Note:** We can also throw errors early in guard clauses instead of returning early!

## 4.Avoid type checking

JavaScript is untyped, which means your functions can take any type of argument. Sometimes you are bitten by this freedom and it becomes tempting to do type-checking in your functions. There are many ways to avoid having to do this. The first thing to consider is "consistent APIs".

```javascript
// Bad!
function travelToTexas(vehicle) {
  if (vehicle instanceof Bicycle) {
    vehicle.pedal(this.currentLocation, new Location("texas"));
  } else if (vehicle instanceof Car) {
    vehicle.drive(this.currentLocation, new Location("texas"));
  }
}

// Good!
function travelToTexas(vehicle) {
  vehicle.move(this.currentLocation, new Location("texas"));
}
class Vehicle {
  move(prevLocation, newLocation) {
    // Logic to drive or pedail
  }
}
```

**Note:**

If you are forced to type check for primitives very often, considering using a type checker tool such as typescript or flow

## 5. Null-Object Pattern

Common mistake: Constant checking of whether the object is null and depending on that check a default action is shown or not.

**Solution**

Create an object that encapsulates the behavior of the null object. Now, we will not need to perform the said verification

This pattern is known as **null-object pattern**.

```javascript
// Bad!
class Dog {
  sound() {
    return 'bark';
  }
}

['dog', null].map((animal) => {
  if(animal !== null) { 
    (new Dog()).sound(); 
  }
});
```

```javascript
// Good!
class Dog {
  sound() {
    return 'bark';
  }
}

class NullAnimal {
  sound() {
    return null;
  }
}

function getAnimal(type) {
  return type === 'dog' ? new Dog() : new NullAnimal();
}

['dog', null].map((animal) => getAnimal(animal).sound());
// Returns ["bark", null]
```

## 6. Remove conditionals using polymorphism

Common mistake: Using `switch` control structure as an alternative to `if`

**Problem:** 

If we have a `switch` in our code we must think that we have just introduced a great complexity to our code that will eventually make us think too much. It adds complexity to our code

**Solution:**

Make use of a solution based on _inheritance_ that makes use of **polymorphism** to avoid this complexity since a class will be created for each of these specific types.

```javascript
// Bad!
// Misuse of these conditionals to define the logic of a method based on the type of the object.
function Auto() {
}
Auto.prototype.getProperty = function () {
  switch (type) {
    case BIKE:
      return getBaseProperty();
    case CAR:
      return getBaseProperty() - getLoadFactor();
    case BUS:
      return (isNailed) ? 
        0 : 
        getBaseProperty(voltage);
  }
  throw new Exception("Should be unreachable");
};
```

```javascript
// Good!
abstract class Auto { 
  abstract getProperty();
}

class Bike extends Auto {
  getProperty() {
    return getBaseProperty();
  }
}
class Car extends Auto {
  getProperty() {
    return getBaseProperty() - getLoadFactor();
  }
}
class Bus extends Auto {
  getProperty() {
    return (isNailed) ? 
      0 : 
      getBaseProperty(voltage);
  }
}
// Somewhere in client code
speed = auto.getProperty();
```

## 7. Remove conditionals using Strategy pattern (composition)/Command pattern

Another way to solve the `switch` / `if` problem

```javascript
// Bad!
function logMessage(message = "CRITICAL::The system ..."){
  const parts = message.split("::"); 
  const level = parts[0];

  switch (level) {
    case 'NOTICE':
      console.log("Notice")
      break;
    case 'CRITICAL':
      console.log("Critical");
      break;
    case 'CATASTROPHE':
      console.log("Castastrophe");
      break;
  }
}
```

```javascript
// Good!
const strategies = {
  criticalStrategy,
  noticeStrategy,
  catastropheStrategy,
}

function logMessage(message = "CRITICAL::The system ...") {
  const [level, messageLog] = message.split("::");
  const strategy = `${level.toLowerCase()}Strategy`;
  const output = strategies[strategy](messageLog);
}

function criticalStrategy(param) {
  console.log("Critical: " + param);
}

function noticeStrategy(param) {
  console.log("Notice: " + param);
}

function catastropheStrategy(param) {
  console.log("Catastrophe: " + param);
}
```

## 8. Don't over-optimize loops

Modern browsers do a lot of optimization under-the-hood at runtime. A lot of times, if you are optimizing then you are just wasting your time

```javascript
// Bad!
// On old browsers, each iteration with uncached `list.length` would be costly
// because of `list.length` recomputation. In modern browsers, this is optimized.
for (let i = 0, len = list.length; i < len; i++) {
  // ...
}

// Good!
for (let i = 0; i < list.length; i++) {
  // ...
}
```

## 9. Favor Map / Object Literal than Switch Statement & If conditionals

Multiple `if`s and `switch`es can be quite verbose!

The same result can be achieve with object literal with cleaner syntax or a map

```javascript
// Bad!
function test(color) {
  // use switch case to find fruits in color
  switch (color) {
    case 'red':
      return ['apple', 'strawberry'];
    case 'yellow':
      return ['banana', 'pineapple'];
    case 'purple':
      return ['grape', 'plum'];
    default:
      return [];
  }
}

//test results
test(null); // []
test('yellow'); // ['banana', 'pineapple']
```

```javascript
// Good!
// use object literal to find fruits in color
  const fruitColor = {
    red: ['apple', 'strawberry'],
    yellow: ['banana', 'pineapple'],
    purple: ['grape', 'plum']
  };

function test(color) {
  return fruitColor[color] || [];
}
```

```javascript
// Even better!
// use Map to find fruits in color
const fruitColor = new Map()
  .set('red', ['apple', 'strawberry'])
  .set('yellow', ['banana', 'pineapple'])
  .set('purple', ['grape', 'plum']);

function test(color) {
  return fruitColor.get(color) || [];
}
```

```javascript
// Equally good! Using Array.proptotype.filter()
const fruits = [
    { name: 'apple', color: 'red' }, 
    { name: 'strawberry', color: 'red' }, 
    { name: 'banana', color: 'yellow' }, 
    { name: 'pineapple', color: 'yellow' }, 
    { name: 'grape', color: 'purple' }, 
    { name: 'plum', color: 'purple' }
];

function test(color) {
  // use Array filter to find fruits in color

  return fruits.filter(f => f.color == color);
}
```

## 10. Suggestion: Avoid negative conditionals

Though not always possible to omit, these add additional complexity that the mind needs to understand and hence, avoid them wherever possible

```javascript
// Bad!
if (!isEmployed) { }

// Good!
if (isEmployed) { } // Try to keep positive conditonals
```