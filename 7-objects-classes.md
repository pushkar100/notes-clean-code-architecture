# Objects & Classes

## 1. Use getters and setters

With getters and setters, we can:

1. Encapsulate the internal representation - Enables us to use private variables instead of `this.prop`
2. Don't have to change every accessor in codebase - easier to make changes
3. Add logging and error handling when getting and setting
4. Lazy load an object's properties, let's say getting it from a server!
5. Adding validation when doing a `set`

```javascript
// Bad!
function makeBankAccount() {
  // ...
  return {
    balance: 0
    // ...
  };
}

const account = makeBankAccount();
account.balance = 100
```

```javascript
// Good!
function makeBankAccount() {
  // this one is private
  let balance = 0;

  // a "getter", made public via the returned object below
  function getBalance() {
    return balance;
  }

  // a "setter", made public via the returned object below
  function setBalance(amount) {
    // ... validate before updating the balance
    balance = amount;
  }

  return {
    // ...
    getBalance,
    setBalance
  };
}

const account = makeBankAccount();
account.setBalance(100);
```

```javascript
// Even better!
function makeBankAccount() {
  // this one is private
  let balance = 0;  

  return {
    // a "getter", made public via the returned object below
    get balance() {
      return balance;
    },
    // a "setter", made public via the returned object below
    set balance(amount) {
      // ... validate before updating the balance
      balance = amount;
    }
  };
}

const account = makeBankAccount();
account.balance = 100;
```

Another example using classes. An advantage of getters and setters is **"computed properties"**. These are properties whose values are calculated on the fly

```javascript
// Good!
class Rectangle {
  constructor(length, width) {
    this._length = length;
    this._width = width;
  }
  get area() {
    return this._length * this._width;
  }
}
```

## 2. Make objects have private members

We don't want to expose every property which can then be accidentally or maliciously changed.

In ES5, we use closures and module/revealing module patterns. In ES6, we have to create workarounds

```javascript
// Bad!
const Employee = function(name) {
  this.name = name;
};

Employee.prototype.getName = function getName() {
  return this.name;
};

const employee = new Employee("John Doe");
console.log(`Employee name: ${employee.getName()}`); // Employee name: John Doe
delete employee.name;
console.log(`Employee name: ${employee.getName()}`); // Employee name: undefined
```

```javascript
// Good!
function makeEmployee(name) {
  return {
    getName() {
      return name;
    }
  };
}

const employee = makeEmployee("John Doe");
console.log(`Employee name: ${employee.getName()}`); // Employee name: John Doe
delete employee.name; // Does not work
console.log(`Employee name: ${employee.getName()}`); // Employee name: John Doe
```

## 3. Use Classes Over Constructor Functions

It's very difficult to get readable class inheritance, construction, and method definitions for classical ES5 classes. 

**Note:**

However, prefer small functions over classes until you find yourself needing larger and more complex objects.

```javascript
// Bad!
// Extremely unreadable
const Animal = function(age) {
  if (!(this instanceof Animal)) {
    throw new Error("Instantiate Animal with `new`");
  }

  this.age = age;
};

Animal.prototype.move = function move() {};

const Mammal = function(age, furColor) {
  if (!(this instanceof Mammal)) {
    throw new Error("Instantiate Mammal with `new`");
  }

  Animal.call(this, age);
  this.furColor = furColor;
};

Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.constructor = Mammal;
Mammal.prototype.liveBirth = function liveBirth() {};

const Human = function(age, furColor, languageSpoken) {
  if (!(this instanceof Human)) {
    throw new Error("Instantiate Human with `new`");
  }

  Mammal.call(this, age, furColor);
  this.languageSpoken = languageSpoken;
};

Human.prototype = Object.create(Mammal.prototype);
Human.prototype.constructor = Human;
Human.prototype.speak = function speak() {};
```

```javascript
// Good!
class Animal {
  constructor(age) {
    this.age = age;
  }

  move() {
    /* ... */
  }
}

class Mammal extends Animal {
  constructor(age, furColor) {
    super(age);
    this.furColor = furColor;
  }

  liveBirth() {
    /* ... */
  }
}

class Human extends Mammal {
  constructor(age, furColor, languageSpoken) {
    super(age, furColor);
    this.languageSpoken = languageSpoken;
  }

  speak() {
    /* ... */
  }
}
```

## 4. Use method chaining

Functions that do a single task, with a single level of abstraction and without side effects need to be combined together to perform complex tasks (i.e combination of several of them). Therefore, it develops chained methods since they allow a more readable code

The concept is similar to piping in linux where small utility functions are "chained" to build more complex functionality

One can also compare the technique to jQuery method chaining.

```javascript
// Bad! No chaining
class Car {
  constructor(make, model, color) {
    /* */
  }
  setColor(color) {
    this.color = color;
  }
  save() {
    console.log(this.make, this.model, this.color);
  }
}    
const car = new Car('WV','Jetta','gray');
car.setColor('red');
car.save();

// ---------------------

// Good!
class Car {
  constructor(make, model, color) {
    /* */
  }
  setColor(color) {
      this.color = color;
      return this;
  }
  save() {
      console.log(this.make, this.model, this.color);
      return this;
  }
}
const car = new Car('WV','Jetta','gray')
  .setColor('red')
  .save();
```

## 5. Prefer composition over inheritance

You should prefer composition over inheritance where you can. The main point for this maxim is that if your mind instinctively goes for inheritance, try to think if composition could model your problem better. In some cases it can.

For most cases, composition can be used in place of inheritance. In some, however, inheritance is useful:

1. Your inheritance represents an "is-a" relationship and not a "has-a" relationship (Human->Animal vs. User->UserDetails)
2. You can reuse code from the base classes (Humans can move like all animals)
3. You want to make global changes to derived classes by changing a base class. (Change the caloric expenditure of all animals when they move)

```javascript
// Inheritance:
class Employee {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // ...
}

// Bad because Employees "have" tax data. EmployeeTaxData is not a type of Employee
class EmployeeTaxData extends Employee {
  constructor(ssn, salary) {
    super();
    this.ssn = ssn;
    this.salary = salary;
  }

  // ...
}
```

```javascript
// Composition:
class EmployeeTaxData {
  constructor(ssn, salary) {
    this.ssn = ssn;
    this.salary = salary;
  }

  // ...
}

class Employee {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  setTaxData(ssn, salary) {
    this.taxData = new EmployeeTaxData(ssn, salary);
  }
  // ...
}
```

**Another example:**

A `Person` has a ‘has-a’ relationship with `Address`, so we shouldn’t use inheritance in this case.

```javascript
// Good!
class Address {
  constructor(streetName) {
    this.streetName = streetName;
  }
}
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  setAddress() {
    this.address = new Address('123 A St.');
  }
}
```

## 6. Have whitespaces before properties on new lines

```javascript
// Good!
foo.map().filter()

// Okay! (not so good)
foo
.map()
.filter()

// Good!
foo
  .map()
  .filter()
```

## 7. Classes Should be Small

Classes should be small. They shouldn’t have more than one responsibility. What we don’t want is to have classes that do multiple things. A God class is what we don’t want.

**Thumbrule:**

If a method does something that’s not covered by the name of the class, then it shouldn’t be there. We should be able to describe what our class does without using the words 'if', 'and', 'or' or 'but'.

```javascript
// Bad!
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  get area() {
    return this.length * this.width;
  }
  // Why does Rectangle class have a createCircle method?
  // The class is a rectangle but/and has a method on circles!
  createCircle(radius) {
  }
}
```

```javascript
// Good!
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  get area() {
    return this.length * this.width;
  }
}
```

**Single Responsibility Principle:**

Identifying responsibilities let us create better abstractions in our code. Anything that violates the single responsibility principle has to be extracted into its own class.

```javascript
// Good!
// Create circle can be inside its own class
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  get area() {
    return Math.PI * (this.radius ** 2);
  }
}
```

## 8. Classes should be maximally cohesive

Classes should have:
1. **A small number of instance variables**
2. **Each method should manipulate one or more instance variables** 

"A class where each variable is used by each method is maximally cohesive."

**Reasons:**

- We like cohesion to be high so that the methods and instance variables are co-dependent and stay together as a whole.
- High cohesion makes reading the code easy since it only revolves around a single concept. 
- They’re also less frequently changed since each class doesn’t do much.

```javascript
// Good!
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  get area() {
    return Math.PI * (this.radius ** 2);
  }
}
```

`Circle` is cohesive because we used our radius instance variable in the area getter method, so we used every instance variable in our method.

**Maintain Cohesion Means Many Small Classes**

Bigger classes have problems maintaining cohesion because we keep adding new instance variables that only a few methods use. **We must split up a class in that case**

```javascript
// Bad!
class Shape {
  constructor(radius, length, width) {
    this.radius = radius;
    this.length = length;
    this.width = width;
  }
  get circleArea() {
    return Math.PI * (this.radius ** 2);
  }
  get rectangleArea() {
    return this.length * this.width;
  }
}
```

```javascript
// Good!
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  get area() {
    return this.length * this.width;
  }
}
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  get area() {
    return Math.PI * (this.radius ** 2);
  }
}
```

## 9. Use ES6 property shorthands

It is much shorter than the original version and is less to read (while still being easy to read it)

```javascript
const a = 1;
const b = 'foo';
const c = 3;

// Bad!
const obj = {
  a: a,
  b: b,
  c: c
}

// Good!
const obj = {
  a,
  b,
  c
}
```

## 10. Use singleton pattern to manage anything global

Global content can be something like **app-wide state**

A singleton is an object that can be **the only instance** of a class. Use `Object.freeze()`

```javascript
// Good!
const data = [];
const Store = {
  add: item => data.push(item),
  getById: id => data.find(d => d.id === id)
}
Object.freeze(Store); // Store and its methods can never change!
// Store also cannot be reassigned (due to `const`)
```

**Converting classes to return the same single instance always**

```javascript
// Good!
class Store {
  constructor() {
    if (!Store.instance) {
      this.data = [];
      Store.instance = this;
    }
    return Store.instance; // The instance is a property on the class, hence static!
  }
  add(item) {
    this.data.push(item);
  }
  getById(id) {
    return this.data.find(d => d.id === id);
  }
}
const store = new Store()
Object.freeze(store);
```

`Store.instance` is static so it’s shared by all instances of the class.

## 11. Reference as little code from external classes as possible

```javascript
// Bad!
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
}
class ShapeCalculator {
  calcRectangleArea(length, width) {
    const rectangle = new Rectangle(length, width);
    return rectangle.length * rectangle.width;
  }
}
```

We have the `ShapeCalculator` class that references the `Rectangle` class a lot. We call its constructor and instance variables.

However, we shouldn’t do this because it’s referencing too much from the `Rectangle` class. We can remove references to the instance variables as follows:

- Extend the referenced class
- Use the extended methods in the referencing class. By doing so, it reduces the number of instance variables used from the referenced class

```javascript
// Good!
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  getArea() {
    return this.length * this.width;
  }
}
class ShapeCalculator {
  calcRectangleArea(length, width) {
    const rectangle = new Rectangle(length, width);
    return rectangle.getArea();
  }
}
```

We didn’t have to touch the internals to get the area of a `rectangle`. It’s much better to not reference the `length` and `width` from a `Rectangle` instance if we don’t have to.

## 12. Pull up constructor body into superclass for overlapping code in subclass constructors

If we have multiple constructor bodies in our subclasses with overlapping code, we can move them to the superclass.

```javascript
// Bad!
class Employee {
}
class Cook extends Employee {
  constructor(name, level) {
    this.name = name;
    this.level = level;
  }
}
class Manager extends Employee {
  constructor(name) {
    this.name = name;
  }
}
```

```javascript
// Good!
class Employee {
  constructor(name) {
    this.name = name;
  }
}
class Cook extends Employee {
  constructor(name, level) {
    super(name)
    this.level = level;
  }
}
class Manager extends Employee {
}
```

## 13. Replace constructor with factory method when customizing creation

If we want to do more things than a simple constructor can do, then we can replace it with a factory method.

```javascript
// Okay!
class Employee {
  constructor(type) {
    this.type = type;
  }
  //...
}
```

```javascript
// Better!
class Employee {
  constructor(type) {
    this.type = type;
  }
  //...
}
const createEmployee = type => new Employee(type);
```

## 14. Use classes and extend it over writing to global functions

We don't want to pollute the global data. It can lead to conflicts, unreliable behavior, and other issues

Imagine we want to add a special method to a certain type of array we have created:

```javascript
// Bad!
Array.prototype.alternateCase = function() {
  return this.map((element, index) => 
    index % 2 
      ? element 
      : element.toUpperCase()
  )
};
['a', 'b', 'c' , 'd'].alternateCase() // ["A", "b", "C", "d"]

// Good!
class SuperArray extends Array {
  alternateCase() {
    return this.map((element, index) => 
      index % 2 
        ? element 
        : element.toUpperCase()
    )
  }
}
const superList = new SuperArray('a', 'b', 'c' , 'd');
superList.alternateCase() // ["A", "b", "C", "d"]
```

## 15. Use `Symbol`s in objects for storing "hidden" properties

We don't have to use symbols for every property of an object. 

Since Symbol keys exist in an explicit but hidden manner, they are useful for storing programmatic information semantically that's unrelated to the core data of the object but useful in fulfilling some programmatic need.

```javascript
// Good!
log.CUSTOM_RENDER = Symbol();

class Person {
  constructor(name) {
    this.name = name;
    this[log.CUSTOM_RENDER] = () => {
      return `Person (name = ${this.name})`;
    };
  }
}

const log = thing => {
 console.log(
   thing[log.CUSTOM_RENDER] ?
     thing[log.CUSTOM_RENDER](thing) :
     thing
 );
};

log(123); // => Logs "123"
log(new Person('Sarah')); // => Logs: "Person (name = Sarah)"
```

In the above code, you may wish to annotate certain objects with a custom logging function that lets you privately analyze the contents of the object. This is perhaps not used directly by a consumer of Person and cannot be as well.

**Benefits of using Symbols as hidden properties:**

- “Hidden” object properties. If we want to add a property into an object that “belongs” to another script or a library, we can create a symbol and use it as a property key. 
- A symbolic property does not appear in `for..in`, so it won’t be accidentally processed together with other properties. 
- Also it won’t be accessed directly, because another script does not have our symbol. So the property will be protected from accidental use or overwrite.

**Note**
- There are not many everyday situations that would necessitate the creation and usage of new symbols.
- **Symbol.iterator** is used inside many systems as a custom iterator function on themselves

## 16. Use `null` for intentional absence of value (`undefined` otherwise)

`null` is used to express the intentional absence of a value.

`undefined` is used to indicate something that is not declared or defined

```javascript
// Example
function setRestaurantFeatures(features) {
  if (features.hasParking) {
    // This will not run if hasParking is null
  }
}

setRestaurantFeatures({
  hasWifi: false,
  hasDisabledAccess: true,
  hasParking: null
});
```

## 17. Use object literals for most creation purposes (simple cases)

The object literal `{}` is the most simple declaration of an object. There is also no "preparation" of an object beforehand in order to use (as opposed to creating it in other ways)

```javascript
// Good!
var myObj = {
  name: 'someName',
  age: 10
}
```

Of course, this is the most popular way of creating objects. There are exceptions where you'd want to instantiate a class, define the properties of an object and so on where an object literal initialization falls short of the requirements.

## 18. Use a `Map` or a `WeakMap` only when you need to store non-primitive keys

**Map vs WeakMap:** WeakMap keys will be delete or lost if the JS compiler garbage collects the data structure being used as the key

```javascript
// CANNOT DO! Error!!
const map = {}

const functionId = function () { /* something */ }
const value = 100

map[functionId] =  value // Error!
```

```javascript
// Good!
const map = new Map()

const functionId = function () { /* something */ }
const value = 100

map.set(functionId, value)
map.get(functionId) // 100
``` 