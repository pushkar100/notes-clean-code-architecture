# Objects & Classes

## 1. Use getters and setters

With getters and setters, we can:

1. Encapsulate the internal representation
2. Don't have to change every accessor in codebase
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
delete employee.name;
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
