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

## 2. Encapsulate conditionals into separate boolean functions

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

**More on guard clauses**

> A guard is a boolean expression that must evaluate to true if the program execution is to continue in the branch in question. Regardless of which programming language is used, guard code or a guard clause is a check of integrity preconditions used to avoid errors during execution

It:

- Removes extra mental effort of conditionals
- Removes possible nesting of conditinals
- Reduces `else` cases (thereby reducing the mental effort needed)

**Too many `else if`s in code? Use guard clauses**

If your code requires cases like else if, it’s because you are breaking the Principle of Single Responsibility and the code makes higher-level decisions, which should be refactored using techniques such as division into submethods or design patterns such as command or strategy.

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
class Airplane {
  // ...
  getCruisingAltitude() {
    switch (this.type) {
      case "777":
        return this.getMaxAltitude() - this.getPassengerCount();
      case "Air Force One":
        return this.getMaxAltitude();
      case "Cessna":
        return this.getMaxAltitude() - this.getFuelExpenditure();
    }
  }
}
```

```javascript
// Good!
class Airplane {
  // ...
}

class Boeing777 extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getPassengerCount();
  }
}

class AirForceOne extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude();
  }
}

class Cessna extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getFuelExpenditure();
  }
}
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
if (!isDomNodeNotPresent(node)) {}

// Good!
if (isEmployed) { } // Try to keep positive conditonals
if (isDomNodePresent(node)) {}
```

## 11. Short-circuiting is better than a single `if-else` during assignment or return

```javascript
// Bad!
function createBookStore(name) {
  var bookStoreName;
  if (name) {
    bookStoreName = name;
  } else {
    bookStoreName = "Generic Book Store"
  }
}

// Good!
function createBookStore(name) {
  const bookStoreName = name || "Generic Book Store";
}
```

We can even short-circuit using **`&&`** to avoid **"TypeError"**

Imagine fetching the first image from a user config. Only if the images property exists and is an array do you want to fetch the image else undefined. This is important because if we try to fetch the first index of a non-array, we'll get an error like "Cannot read property/index of undefined"

```javascript
// Bad!
function getFirstUserImage(userConfig) {
  if (userConfig.images) {
    return userConfig.images[0] // Not testing if "images" is an array
  }
}
```

```javascript
// Good!
function getFirstUserImage(userConfig) {
 return (userConfig.images && user.images.length) 
  ? userConfig.images[0] 
  : undefined
}
```

## 12. Choose declarative programming over imperative

- Imperative programming concerns itself with **how** something is accomplished 
- Declarative programming concerns itself with **what** we want accomplished.

```javascript
// Bad! Imperative
function getUnpaidInvoices(invoiceProvider) {
  const unpaidInvoices = [];
  const invoices = invoiceProvider.getInvoices();
  for (var i = 0; i < invoices.length; i++) {
    if (!invoices[i].isPaid) {
      unpaidInvoices.push(invoices[i]);
    }
  }
  return unpaidInvoices;
}
```

The above code initializes an empty array, initializes a counter, checks that counter (multiple times) , and increments that counter (multiple times). Therefore, it is focusing on a lot of **ANNOYING IMPLEMENTATION DETAILS**

```javascript
// Good! Declarative
function getUnpaidInvoices(invoiceProvider) {
  return invoiceProvider.getInvoices().filter(invoice => {
    return !invoice.isPaid;
  });
}
```

Using declarative programming, we have freed ourselves from the complexity of conventional control flow by using an abstraction.

Declarative patterns have become the **STAPLE of modern JavaScript**. 

- Do not have to worry about lower layers of abstraction (such as how to iterate). We can focus on business logic at our level of abstraction
- There is some overlap, however, between declarative and imperative approaches. 
- In declarative, you are dealing with a higher level of abstraction and less implementation details
- On the imperative side of the spectrum, you are operating at a lower level of abstraction, utilizing lower-level imperative constructs to tell the machine what you want to accomplish

**The benefits of a declarative approach**

- Increased clarity for the human reader
- Efficiently model complex problem domains.
- Mind is free from implementation details (focused on goals)

### Application of declarative programming: Use Array methods over for/while/do-while loops

**Why?**

To remove _clutter_ and to make the code more _readable_ (because it will be more declarative). In normal loops, you have a lot of extra variables, extraneous code, and is less predicatable (again, since it is imperative and not declarative)

```javascript
// Bad! Too imperative!
// Filter items, map the remaining to a string, and reduce it to a message:
function greetTheAdults(people) {
  const adults = []
  for (let i = 0; i < people.length; i++) {
    const person = people[i]
    if (person.age >= 18) {
      adults.push(person)
    }
  }

  const namesOfAdults = []
  for (let i = 0; i < adults.length; i++) {
    const adult = adults[i]
    namesOfAdults.push(adult.name)
  }

  let message = "Welcome "
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    if (i !== names.length - 1) {
      message += `${name}, `
    } else {
      message += `${name}`
    }
  }

  displayMessage(message)
}
```

Certain array methods:
1. **Do not mutate** the original array!
2. Can be **chained**!

**Common array methods that can substitute loops:**

- `map`: Changes the shape but not the size of the array. Maps every value in array to another
- `sort`: Changes the order
- `filter`: Changes the size. Filters out the array based on return value of callback
- `find`: Changes size to exactly one. Returns an array item if it matches condition in callback. _Use find over filter when you want to get the first match. It is similar to a `break` statement in a loop_
- `forEach`: Changes nothing. Only uses the shape
- `reduce`: Changes both size and shape to anything you want it to be

Boolean functions:

- `some`: Returns `true` if at least some of the array items pass the condition in the callback
- `every`:Returns `true` only if all the array items pass the condition in the callback

Convert to strings:

- `join`: Returns a string with the array elements joined by a specified delimiter

**Note**: For succinctness and readability, we generally write the method callbacks using ***arrow functions***

**Examples**

```javascript
// Good! Declarative
// Filter items, map the remaining to a string, and reduce it to a message:
function greetTheAdults(people) {
  const isAdult = person => person.age >= 18
  const getNameOfPerson = person => person.name
  const commaDelimiter = ', '
  const greetStart =  "Welcome"

  const greeting = people
    .filter(isAdult)
    .map(getNameOfPerson)
    .join(commaDelimiter)

  displayMessage(`${greetStart} ${greeting}`)
}
```

**Loop substitutes**

- Create arrays of a similar size with `map` (1:1 mapping)
- Pull out subsets of data with `filter` and `find`
- Combine methods with chaining
- Apply consistent actions with `forEach`
- Transform array data with `reduce`

```javascript
// Good!
// forEach example
const names = ['Ram', 'Lakshmana', 'Sita', 'Sidharth']
const minLength = 5
const longFunkyNames = []

names.forEach(name => {
  if (name.length < minLength) {
    return
  }

  const isEvenIndex = index => index % 2 === 0
  const funkyName = name
    .split('')
    .map((char, index) => 
      isEvenIndex(index) 
        ? char.toLowerCase()
        : char.toUpperCase()
    )
    .join('')
    
  longFunkyNames.push(funkyName)
})

longFunkyNames // ["lAkShMaNa", "sIdHaRtH"]
```

```javascript
// Good!
// reduce example
const EMPLOYEE_TYPES = Object.freeze({
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  EMPLOYEE: 'employee'
})
const employees = [
  { name: 'A', type: EMPLOYEE_TYPES.MANAGER },
  { name: 'B', type: EMPLOYEE_TYPES.SUPERVISOR },
  { name: 'C', type: EMPLOYEE_TYPES.EMPLOYEE },
  { name: 'D', type: EMPLOYEE_TYPES.EMPLOYEE },
  { name: 'E', type: EMPLOYEE_TYPES.SUPERVISOR }
]
const employeesCountReducer = (employeeCountObj, employee) => {
  employeeCountObj[employee.type] = employeeCountObj[employee.type] ? 
    employeeCountObj[employee.type] + 1 
    : 1
  return employeeCountObj
}

const employeeCounts = employees.reduce(employeesCountReducer, {})
/*
{manager: 1, supervisor: 2, employee: 2}
*/
```

Predictability with `map` function:
- We know it will return an array
- We know that it will return an array of the same size as the original
- By the identifier (variable) it is assigned to, we can know the type of mapping it is making🙌

**What about performance?**

For loops and only micro-optimized over array methods. Modern compilers even optimize the methods. Not a significant change for regular apps (Ex: React apps)

**Drawback of array methods**

All these array methods take only one argument (actually, they also have index and original array as the 2nd and 3rd arguments, respectively) and it is very hard for us to pass something to the function.

Consider the example where you have campaign managers of a politician for every district. You want to find the name of the manager given a district

```javascript
// Good but can be better!
const campaignManagers = [
  { name: 'Lokesh', city: 'Delhi' },
  { name: 'Ramesh', city: 'Bhopal' },
  { name: 'Sanya', city: 'Bengaluru' },
  { name: 'Tanya', city: 'Mysuru' }
]

const getCampaignManagerForCity = (campaignManagers, city) => {
  const findCampaignManagerByCity = campaignManager => campaignManager.city === city
  return campaignManagers.find(findCampaignManagerByCity)
}

getCampaignManagerForCity(campaignManagers, 'Bengaluru')
```

**Solution**: The technique of ***currying*** comes to our rescue! We can have partial application using one argument and provide the rest of the params at a later stage. The way you would implement currying is to have a function that takes in the intial argument. It returns a function that contains the business logic. Now this function can take in the rest of the parameters

```javascript
// Best!
const campaignManagers = [
  { name: 'Lokesh', city: 'Delhi' },
  { name: 'Ramesh', city: 'Bhopal' },
  { name: 'Sanya', city: 'Bengaluru' },
  { name: 'Tanya', city: 'Mysuru' }
]

const campaignManagersFilter = (prop, value) => campaignManager => {
  return campaignManager[prop] === value
}

const findCampaignManager = (campaignManagers, prop, value) => {
  return campaignManagers.find(campaignManagersFilter(prop, value))
}

// Extensible!
findCampaignManager(campaignManagers, 'city', 'Bengaluru') // {name: "Sanya", city: "Bengaluru"}
findCampaignManager(campaignManagers, 'name', 'Tanya') // { name: 'Tanya', city: 'Mysuru' }
```

**When should we use `forEach`?**

Use it only when you have to do something outside the scope of the function. That is, when you need to cause a _side effect_! An example of this would be to send an email to every user in the list. We will have a `sendEmail` function outside the scope.

Why should side effects related to array usage use `forEach`?
- Adds predictability. When you use `forEach`, you know that it is for a side effect
- `forEach` can be used just like other array methods. Hence, it can be chained!

**Array method chaining caveats**

- It has an overhead with more looping and function context switching. However, this only matters if you are dealing with very large data sets. For regular use cases, place readability over micro-performance increase.
- The order of chaining matters

## 13. Use declarative programming by hiding/abstracting conditional and loop complexities

Applies to a lot of **nested** conditionals and loops.

```javascript
// Bad!
let featureIsEnabled = true;
for (let i = 0; i < feature.flags.length; i++) {
  if (feature.flags[i] === Feature.DISABLED_FLAG) {
    featureIsEnabled = false;
    break;
  }
}
if (!featureIsEnabled) {
  for (let i = 0; i < feature.enabledTimeSlots.length; i++) {
    if (feature.enabledTimeSlots[i].isNow()) {
      featureIsEnabled = true;
      break;
    }
  }
}
if (featureIsEnabled) {
  // Do the task.
}
```

This is undesirably complex code. We only want to know if the feature is enabled so that we can do our task. Also, it deals with low level complexity (imperative)

```javascript
// Good!
class Feature {
  // (Other methods of the Feature class here,..)
  _hasDisabledFlag() {
    return this.flags.includes(Feature.DISABLED_FLAG);
  }
  _isEnabledTimeSlotNow() {
    return this.enabledTimeSlots.filter(ts => ts.isNow()).length;
  }
  isEnabled() {
    return !this._isDisabledFlag() && this._isEnabledTimeSlotNow();
  }
}

// Usage:
if (feature.isEnabled()) {
  // Do the task.
}
```

These very small declarative additions to the Feature class enable us to write the declarative code we were originally aiming for: `if (feature.isEnabled) { /* Do something */ }`

> This doesn't mean our code is without control flow; rather, it means that the control flow is either minimized or hidden away under layers of abstractions. When using the native control flow constructs of the JavaScript language, it is important to remember that they are not your only tool with which to express the flow of a program; you can redirect and split complicated logic into abstractions that each handle a very specific part of your program's flow (Excerpt from "Clean Code in Javascript" by James Padolsey).

## 14. Favor switch-case over if

An `if` statement is good as long as there are only a few possible outcomes of a condition. Preferably two (An `if` and an `else`). 

When the number of `if`s increase, it is better to use a `switch` so that it is less unwieldy (disorganized or functions inefficiently).

```javascript
// Bad!
function doesSomething(value) {
  if (value) {

  } else if () {

  } else if () {
    
  } else if () {
    
  } else {

  }
}
```

```javascript
function doesSomething(value) {
  switch(value) {
    case 'A': {}
    case 'B': {}
    case 'C': {}
    default: {}
  }
}
```

## 15. Remove Cyclomatic Complexity

Cyclomatic complexity is a measure of how many linearly independent paths there are through a program's code.

```javascript
// Bad!
if (a) {
  A()
  if (b) {
    B()
  }
  if (c) {
    C()
  }
}
if (d) {
  D()
}
```

There are `9` different paths that an execution can take:

- A()
- A(), B()
- A(), B(), C()
- A(), B(), C(), D()
- A(), B(), D()
- A(), C()
- A(), C(), D()
- A(), D()
- D()

Cyclomatic complexity is **undesirable**!

- **Cognitive burden:** Cyclomatically complex code can be difficult for programmers to understand. Code with many branches is difficult to internalize and hold in our minds and therefore harder to maintain or change. 
- **Unpredictability:** Cyclomatically complex code can be unpredictable, especially if rare situations occur where there is, for example, an unforeseen state transition or underlying change of data.  
- **Fragility:** Cyclomatically complex code can be fragile in the face of change. Changing one line can have a disproportionate effect on the functionality of many other lines.
- **Bugginess:** Cyclomatically complex code can cause obscure bugs. If there are a dozen or more code paths within a singular function, then it's possible for a maintainer to not see all of them, leading to regressions

**Identifying and avoiding cyclomatic complexity**

- Too many `if/else/if` combinations (Ex: More than an `if` and an `else`)
- If has too many sub-conditions (Nested ifs)
- Switch has too many sub-conditions in each case (Ex: Many `if-else`'s in a case)
- Switch has too many cases (Ex: More than 5, 10, 20; Depends on the context)

Basically, we can make our code **more declarative!**. For example, use built in functions like `map`,`reduce`, `filter`, `forEach`, etc. Abstract out complex conditionals into functions with readable and meaningful names.

**Example of removing Cyclomatic Complexity**

```javascript
// Bad!
function getIDsFromLicenses(licenses) {
  const ids = [];
  for (let i = 0; i < licenses.length; i++) {
    let license = licenses[i];
    if (license.id != null) {
      if (license.id.indexOf('c') === 0) {
        let nID = Number(license.id.slice(1));
        if (nID >= 1000000) {
          ids.push({ type: 'car', digits: nID });
        } else {
          ids.push({ type: 'car_old', digits: nID });
        }
      } else if (license.id.indexOf('h') === 0) {
        ids.push({
          type: 'hgv',
          digits: Number(license.id.slice(1))
        });
      } else if (license.id.indexOf('m') === 0) {
        ids.push({
          type: 'motorcycle',
          digits: Number(license.id.slice(1))
        });
      }
    }
  } 
  return ids;
}
```

```javascript
// Good!
function getIDsFromLicenses(licenses) {
  return licenses
    .map(license => license.id)
    .filter(Boolean)
    .map(id => getIDFields(
      id.charAt(0),
      Number(id.slice(1))
    ))
}

function getIDFields(idType, digits) {
  switch (idType) {
    case 'c': return {
      type: digits >= 1000000 ? 'car' : 'car_old',
      digits
    };
    case 'h': return { type: 'hgv', digits };
    case 'm': return { type: 'motorcycle', digits };
  }
}
```

Benefits of the above code:

- We can test each individual abstraction separately. Ex: test `getIDFields` on its own
- We have extracted repeated logic (Ex: Doing `indexOf` everytime) and generalized it (DRY principle)

## 16. Use Ternary operators for quick if-else checks

They help cut down the number of variables being re-assigned. They add more **predictability** to the value of a variable which otherwise requires more effort to scan through if-else. No reassignments required

```javascript
// Bad!
let salary
if (employee.isManager) {
  salary = 100000
} else {
  salary = 50000
}

// Good!
const salary = employee.isManager ? 100000 : 50000
```

## 17. Do not chain ternary expressions together

Ternaries lose simplicity. This is as bad as having if else and complex conditionals. For such things, it makes sense to abstract them away into small, non-abstract functions that follow SRP (and are testable)

```javascript
// Bad!
const salary = employee.isManager ? 
  100000
  : employee.isSupervisor ? 
    75000
    : 50000

// Good!
function getSalary(employee) {
  if (employee.isManager) {
    return 100000
  }
  if (employee.isSupervisor) {
    return 75000
  }
  return 50000
}

const salary = getSalary(employee)
```

## 18. Abstract many `if-else` into small functions

How many conditionals is too many? The answer is that is depends since it is subjective. However, as a thumbrule, 3 (`if-elseif-else`) or more can be quite hard to read when compared to when its abstracted to a function with a meaningful name

```javascript
// Bad!
let sides
if (order.burger) {
  sides = 'fries'
} else if (order.pizza) {
  sides = 'garlic bread'
} else {
  sides = 'none'
}
```

```javascript
// Good!
function getSidesForOrder(order) {
  if (order.burger) {
    return 'fries
  }
  if (order.pizza) {
    return 'garlic bread'
  }
  return 'none'
}

// We didn't reduce the number of if-else
// But we abstracted it away
// so that consumer code is readable (meaning via naming)
const sides = getSidesForOrder(order)
```