# The Law of Demeter

The Law of Demeter states that we should hide the implementation details of our code as much as we can. 

**Why?**

This ensures that we have loose coupling between our code.

**Why is loose coupling good?**

Loose coupling means that we don’t have to worry about changing a lot of code when one piece of code changes.

Each unit only has limited knowledge about other units so that only a few parts of the other units are referenced

So this means that if we have 2 classes `A` and `B` , then `A` only references the methods of `B` than has to be referenced. Other members are kept private along with other implementation details

## How do we apply the Law of Demeter?

We can apply the Law of Demeter to our JavaScript code by writing it in a way that references a few classes and members of them as possible

We can apply the Law of Demeter to our JavaScript code by writing it in a way that references a few classes and members of them as possible.

An example of classes that references each other too much is the following:

```javascript
// Bad!
class PostalCode {
  constructor(postalCode) {
    this.postalCode = postalCode;
  }
  setPostalCode(postalCode) {
    this.postalCode = postalCode;
  }
}
class Address {
  constructor(streetName) {
    this.streetName = streetName;
  }
  getPostalCode() {
    return this.postalCode;
  }
  setPostalCode(postalCode) {
    this.postalCode = new PostalCode(postalCode);
  }
}
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  setAddress(address) {
    this.address = new Address(address);
  }
  getAddress() {
    return this.address;
  }
}
```

We have the `Address` class that references `PostalCode`, and `Person` class that references `Address` and Occupation. If any of `Address` and `PostalCode` change, then we have to change the `Person` and `Address` class.

Also, we have to set the postal code of a `Person` by writing: `person.getAddress().getPostalCode().setPostalCode('12345');`

That’s a lot of chaining involving returning instances of different classes. If any of these methods change, then the whole chain has to be rewritten.

What we should do instead is to combine all the references into one method as follows:

```javascript
// Good!
class PostalCode {
  constructor(postalCode) {
    this.postalCode = postalCode;
  }
  setPostalCode(postalCode) {
    this.postalCode = postalCode;
  }
}
class Address {
  constructor(streetName) {
    this.streetName = streetName;
  }
  getPostalCode() {
    return this.postalCode;
  }
  setPostalCode(postalCode) {
    this.postalCode = new PostalCode(postalCode);
  }
}
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  setAddress(address) {
    this.address = new Address(address);
  }
  getAddress() {
    return this.address;
  }
  getPostalCode() {
    return this.postalCode;
  }
  setPostalCode(postalCode) {
    this.postalCode = new PostalCode(postalCode);
  }
}
```

Then we only have to update the `Person` class if the `PostalCode` class changes instead of updating the whole chain of calls just to update the getting and setting the postal code when the `PostalCode` class changes.

The point is that we should have to know the whole system to get something done.

`PostalCode` doesn’t have to be connected to `Address` since they can be changed individually. If we couple them together, then we have to know about `Address` before changing `PostalCode`.

The example above shows coupling that can be avoided and it should be.

## Facade Pattern

We can also use the facade pattern to hide the complexity of a system so that we don’t have to know about them.

For example, we can hide multiple classes behind a facade class and then use the facade class to indirectly interact with multiple classes that hide behind the facade class as follows:

```javascript
// Good!
class ClassA {
}
class ClassB {
}
class ClassC {
}
class Facade {
  constructor() {
    this.a = new ClassA();
    this.b = new ClassB();
    this.c = new ClassC();
  }
}
class Foo {
  constructor() {
    this.facade = new Facade();
  }
}
```

In the example above, the `Foo` class knows nothing about what’s behind the `Facade` class. The `Facade` class holds instances of `ClassA` , `ClassB` , and `ClassC`

It provides a simple interface to a complex system which consists of `ClassA` , `ClassB` , and `ClassC`

When any of the classes behind Facace changes, we just have to change the `Facade` class. It serves as an entry point to all we want to do with those classes. Instead of referencing them all individually and creating a mess of references, we have one unified interface for all of them. This satisfies the Law of Demeter because we only access the `Facade` class to do anything with `ClassA` , `ClassB` , and `ClassC`. We don’t have to know about the underlying implementation of them.

It makes the software easy to use, understand and test since we only have to use and test `Facade` to interact with all the classes underneath. It removed the need to reference multiple parts of a complex system since the `Facade` class provides all we need.

If the code underneath the facade class is poorly designed, we can also wrap around it with a well-designed API that helps people using the `Facade` class to work with it in an easy way.

Most importantly, tight coupling is eliminated since nothing but the `Facade` class references the complex code underneath it.
