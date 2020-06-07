# Conditional Complexity

**Avoid Conditional Complexity**

Conditional complexity causes code to be more complicated to understand and therefore harder to maintain

## 1. Don’t use flags as function parameters

The first advice to avoid complexity is to eliminate flags as parameters of a function 

Instead, we must create two functions that implement the logic of our problem, instead of using a single function in which we have the logic of the two functionalities since they are different

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

## 4. Null-Object Pattern

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

## 5. Remove conditionals using polymorphism

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

## 6. Remove conditionals using Strategy pattern (composition)/Command pattern

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