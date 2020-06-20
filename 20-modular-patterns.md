# Modular patterns

Modular patterns are the structures and syntactic conventions we use to craft individual modules. These can sit inside an ES6 module files (`import/export` based hamony modules in the specification) and we typically have one of these patterns per file

**Note**

If you find yourself using these patterns several times within the same file, then it may be worth splitting them out. The directory and file structure of a given code base should ideally reflect its landscape of abstractions. You shouldn't have several abstractions crammed into a single file.

## 1. Constructor & Class pattern

The Constructor pattern uses a singular constructor and then manually fills its prototype with methods and properties. This was the traditional approach for creating classical OOP-like classes in JavaScript before the class definition syntax existed

**Constructor**

```javascript
function Book(title) {
  // Initialization Logic
  this.title = title;
}

Book.prototype.getNumberOfPages = function() { /* ... */ };
Book.prototype.renderFrontCover = function() { /* ... */ };
Book.prototype.renderBackCover = function () { /* ... */ };

const myBook = new Book();
```

The Constructor pattern is useful in scenarios where you wish to have an abstraction that encapsulates the concept of a noun, that is, a thing that would make sense to have an instance of. The Constructor pattern allows you to create abstractions akin to traditional OOP classes.

**Note**

The Constructor pattern has largely fallen out of favor since the introduction of class definitions into JavaScript, which allow you to declare classes in a fashion much more akin to classical OOP languages (that is, `class X extends Y {...}`).

**Class**

The Class pattern, which relies on the newer class definition syntax, has largely replaced the Constructor pattern. However, under the hood it still uses the same constructor and prototypal mechanism that exists in the language (javascript is not a classical OOP-based language).

However, the class pattern is cleaner since it is more _aesthetic_ and _less clunky_ compared to the constructor pattern

```javascript
class Name {
  constructor(forename, surname) {
    this.forename = forename;
    this.surname = surname;
  }
  sayHello() {
   return `My name is ${this.forename} ${this.surname}`;
  }
}

const myName = new Name('Pushkar', 'DK')
myName.sayHello() // My name is Pushkar DK
```

**More power with classes**

1. Static methods: Use `static` keyword or simply, `<className>.<staticPropertyName>`

```javascript
class Accounts {
  static allAccounts = [];
  static tallyAllAccounts() {
    // ...
  }
}

Accounts.tallyAllAccounts();
Accounts.allAccounts; // => []

// Alternate way:
Accounts.countAccounts = () => {
  return Accounts.allAccounts.length;
};
```

2. Public and private fields _(new in 2019 ECMAScript specification)_

Use identifiers (without a qualifier such as `var`, `const` or `let`) inside classes for public methods and `#` prefixed ones for private fields.

```javascript
class Rectangle {
  width = 0; // public: this.width
  height = 0; // public: this.width

  constructor(width, height) {
    this.width = width
    this.height = height
  }
}

const rect = new Rectangle(100, 200)
rect.width // 100
```

```javascript
class Rectangle {
  #width = 0; // private: this.#width
  #height = 0; // private: this.#width

  constructor(width, height) {
    this.#width = width
    this.#height = height
  }
}

const rect = new Rectangle(100, 200)
rect.width // Undefined!
```

Private fields do not exist on the public domain of that class. Hence, trying to access the property gives us `undefined`

Private fields should be used with extreme caution as they can severely limit the extensibility of your code, hence increasing its rigidity and lack of flexibility.

3. Extending classes

Inheritance within the Class pattern can very simply be achieved by using the `class ... extends` syntax

```javascript
class Animal {}
class Tiger extends Animal {} 
```

4. Accessing a super class:

Use `super`. Invoke `super()` inside child constructor before using `this` (will throw an error if not adhered to).

```javascript
class Tiger extends Animal {
  constructor() {
    super(); // I.e. Call Animal's constructor
  }
}
```

5. Mixing-in classes

Conventionally, an extension is used not only to create semantic sub-classes but also to provide mixins of methods.

In JavaScript we can only inherit from a single object. There can be only one `[[Prototype]]` for an object. And a class may extend only one other class.

But sometimes that feels limiting. For instance, we have a class `StreetSweeper` and a class `Bicycle`, and want to make their mix: a `StreetSweepingBicycle`.

- Method 1: We can achieve this by specifying mixins as objects and then adding them to prototype of a class via a convenient method such as `Object.assign`:

```javascript
// mixin
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`);
  },
  sayBye() {
    alert(`Bye ${this.name}`);
  }
};

// usage:
class User {
  constructor(name) {
    this.name = name;
  }
}

// copy the methods
Object.assign(User.prototype, sayHiMixin);

// now User can say hi
new User("Dude").sayHi(); // Hello Dude!
```

There is a **drawback**! You cannot override the mixin class inside your own class! If you include a mixin property or method then your corresponding class property of the same name will be shadowed by it always. Let's use subclass factories for inheritance and solve this problem with mixins

- Method 2 (recommended): This can most easily be achieved by so-called _"Subclass Factories"_. These are essentially just functions that themselves return a class that extends a specified super-class:

```javascript
const greetingsMixin = Super => class extends Super {
  hello() { return 'hello'; }
  hi() { return 'hi'; }
  heya() { return 'heya'; }
};

class Human {}
class Programmer extends greetingsMixin(Human) {}
new Programmer().hi(); // => "hi"
```

A more generic version:

```javascript
function mixin(...mixins) {
  return mixins.reduce((base, mixin) => {
    return mixin(base);
  }, Object);
}

const alpha = Super => class extends Super { alphaMethod() {} };
const bravo = Super => class extends Super { braveMethod() {} };

class MyClass extends mixin(alpha, bravo) {
  myMethod() {}
};
```

The "base" class will always be a mixin. Therefore, its methods can always be overriden by our child class.

**When should we use a constructor or a class pattern?**

- Is the concept expressible as a noun (ex: people, place, or thing)? 
- Does the concept require construction? 
- Will the concept vary between instances?

**When not to use a constructor or a class pattern?**

If the concept you're abstracting does not fulfill any of the preceding three criteria, do not use it. An example of this may be a utility module that has various helper methods. Such a module may not require construction since it is essentially a collection of methods, and these methods and their behaviors would not vary between instances.

## 2. Prototype pattern ("Object extension" / "No-constructor approach to prototypal inhertance" pattern)

Instead of having classes or constructors and extending it, we can have plain objects (Object literals in Javascript `{}`)

We use the object literal as a "template" and extend it without fussing about instantiation with `new` or worrying about prototype objects and so on (that we have to deal with in classes)

```javascript
const inputComponent = {
  name: 'Input Component',
  render() {
    return document.createElement('input');
  }
};

// Extensions:
const inputA = Object.create(inputComponent);
const inputB = Object.create(inputComponent);
```

We use `Object.create` to use the template object literal as the prototype object for the new object literal that is creates (for `inputA` and `inputB`)

**Better way**

We can add the extend functionality into the template object itself.

```javascript
const inputComponent = {
  name: 'Input Component',
  render() {
    return document.createElement('input');
  },
  extend() {
    return Object.create(this)
  }
};

const inputA = inputComponent.extend();
const inputB = inputComponent.extend();
```

**We can also override template object when extending it**

We can override functionality of the template when extending it by using `Object.assign()`.

```javascript
const numericalInputComponent = Object.assign(
  inputComponent.extend(), 
  {
    render() {
      const input = InputComponent.render.call(this);
      input.type = 'number';
      return input;
    }
  }
); 
```

**When do we use the prototype pattern over a class or constructor pattern?**

Prototype pattern essentially does what a class or constructor does: Extend objects that have varying characteristics which can also be inherited from another object.

However, use:
- Prototype pattern for _simple_ use cases such as data changing minimally between objects or if the base data itself can be a simple object without needing a class. 
- Class/constructor pattern for data that is not basic! Use it for object creation where they can be managed better via instantiation and so on. Classes for simple objects might be an _overkill_