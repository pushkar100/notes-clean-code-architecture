# SOLID Principles

Like any other programming language, JavaScript is also subject to the principles outlined in SOLID.

SOLID consists of 5 concepts that we can use to make our programs better:

- **S**: Single Responsibility Principle (SRP)
- **O**: Open/Closed Principle (OCP)
- **L**: Liskov Substitution Principle (LSP)
- **I**: Interface Segregation Principle (ISP)
- **D**: Dependency Inversion Principle (DIP)

It's important to note that, while SOLID relates mostly to OOP, there are deeper truths underlying it that are useful regardless of your programming paradigm.

## 1. Single Responsibility Principle (SRP)

_"There should never be more than one reason for a class to change"._

It's tempting to jam-pack a class with a lot of functionality, like when you can only take one suitcase on your flight. The issue with this is that your class won't be conceptually cohesive and it will give it many reasons to change. 

**Minimizing the amount of times you need to change a class is important**

It's important because if too much functionality is in one class and you modify a piece of it, it can be difficult to understand how that will affect other dependent modules in your codebase.

```javascript
// Bad!
class UserSettings {
  constructor(user) {
    this.user = user;
  }

  changeSettings(settings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}
```

```javascript
// Good!
class UserAuth {
  constructor(user) {
    this.user = user;
  }

  verifyCredentials() {
    // ...
  }
}

class UserSettings {
  constructor(user) {
    this.user = user;
    this.auth = new UserAuth(user);
  }

  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

**Another example:**

The single responsibility principle says that each of our classes has to be only used for one purpose.

We need this so that:

1. We don’t have to change code as often when something changes. 
2. It’s also hard to understand what the class is doing if it’s doing many things.

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
  createCircle() {
    // Why?
  }
}

// We should NOT have a createCircle method in a Rectangle class since they’re unrelated concepts.
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

The Rectangle class above only has the length and width of a rectangle as members and lets us get the area from it. It does nothing else, so it follows the single responsibility principle.

**Another attempt at explaining SRP**

Whenever we write code, we are creating abstractions. How to delineate (describe exactly, position properly) abstractions in the right way is what SRP deals with.

The aims of the SRP are to arrive at code that is highly **cohesive**. Cohesiveness is when an abstraction's parts are all functionally united in some way, where they can all be said to work together to fulfill the abstraction's purpose.

_"How many reasons do we have for a class to change?". Ideally, it shouldn't be more than one_

```javascript
// Bad!
class Calendar {
  addEvent(event) {...}
  removeEvent(event) {...}
  getEventsBetween(stateDate, endDate) {...}
  setTimeOfEvent(event, startTime, endTime) {...}
  setTitleOfEvent(event, title) {...}
  exportFilteredEventsToXML(filter) {...}
  exportFilteredEventsToJSON(filter) {...}
}

class Event {}
```

The calendar class has so many reasons to change:
1. If the way time is defined, we need to change it
2. If the way events are searched for (in between time) changes
3. The way titles are defined on events may need to change
4. There are changes to way XML and JSON is exported. For ex: Schema changes

Why is a high level class like calendar worrying about details of event setting and search? Why is the export functionality not an abstraction of its own - calendar is not directly responsible for it!

```javascript
// Good!
class Event {
  setTime(startTime, endTime) {...}
  setTitle(title) {...}
}

class Calendar {
  addEvent(event) {...}
  removeEvent(event) {...}
  getEventsBetween(startDate, endDate) {...}
}

class CalendarExporter {
  exportFilteredEventsToXML(filter) {...}
  exportFilteredEventsToJSON(filter) {...}
}
```

**The tenets of clean code emphasized by SRP**

_RELIABILITY_ and _EFFICIENCY_

The SRP is not only about creating abstractions that are simple to use and maintain (like the Law of Demeter), it also allows us to write code that is more **focused** (by way of cohesiveness of an abstraction's methods and properties) on its key purpose.

### SRP applied to classes

A class and its methods should focus on one responsibility, not more! 

```javascript
// Bad!
class Journal {
  static journalCount = 0

  constructor() {
    this.journal = {}
  }

  addEntry() {}

  removeEntry() {}

  readJournal() {}

  saveJournal() {}

  loadJournal() {}
}
```

A journal deals with adding, removing, and reading entries. How does it matter where and how we save a journal to or load it from?

`saveJournal()` & `loadJournal()` violate SRP as they deal with persistent storage rather than with maintaining a journal. What if data to be stored is different from actual journal entry, what if storage types are configurable (filesystem, memory, etc). `Journal` class will have to deal with all of it and that's not cool!

_A class should not have a secondary responsibility!_. Unrelated functionality may break when changes in one of the responsibilities needs to update

We should not have **GOD classes** that do everything (anti-pattern)

We can create a separate class for persistent storage, and journal can be passed as one type of data to store, as well as the type of storage to use

```javascript
// Good!
class Journal {
  static journalCount = 0

  constructor() {
    this.journal = {}
  }

  addEntry() {}

  removeEntry() {}

  readJournal() {}
}

class PersistentStorage {
  constructor(documentType, storageType) {
    this.documentType = documentType
    this.storageType = storageType
  }

  save() {}

  load() {}
}

// Usage:
const journal = new Journal()
const fileSystemJournalStore = new PersistentStorage('journal', 'fs')

fileSystemJournalStore.save(journal)
```

### Having an eye for SRP (avoiding violations)

1. Scan the methods of an entity (i.e class)
  - If there are two responsibilities then the secondary responsibility can be its own class
2. Having `and` in a function or class name indicates SRP violation
  - Ex: `makeTeaAndAddSugar()` can be split into `makeTea()` and `addSugar()`

## 2. Open/Closed Principle (OCP)

"Software entities" (_classes_, _modules_, _functions_, etc.) should be **open for extension**, but **closed for modification**." What does that mean though? This principle basically states that you should allow users to add new functionalities without changing existing code.

```javascript
// Bad!
class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = "ajaxAdapter";
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = "nodeAdapter";
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    if (this.adapter.name === "ajaxAdapter") {
      return makeAjaxCall(url).then(response => {
        // transform response and return
      });
    } else if (this.adapter.name === "nodeAdapter") {
      return makeHttpCall(url).then(response => {
        // transform response and return
      });
    }
  }
}

function makeAjaxCall(url) {
  // request and return promise
}

function makeHttpCall(url) {
  // request and return promise
}
```

```javascript
// Good!
class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = "ajaxAdapter";
  }

  request(url) {
    // request and return promise
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = "nodeAdapter";
  }

  request(url) {
    // request and return promise
  }
}

// A "configuration" based extension example!
class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    return this.adapter.request(url).then(response => {
      // transform response and return
    });
  }
}
```

**Another example:**

**OCP** means that we should be able to add more functionality without changing existing code.

Example:

```javascript
// Rectangle class
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  get area() {
    return this.length * this.width;
  }
}
// How do we add extra functionality to this class?
```

```javascript
// We add it by adding a method to the class (instead of changing the class at a more basic level)
// We are not modifying the class - existing methods and properties remain as they are!
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  get area() {
    return this.length * this.width;
  }
  // Extended method: Open to extension, closed to modification
  get perimteter() {
    return 2 * (this.length + this.width);
  }
}
```

**Alternate explanation**

The OCP is for other programmers. Think of people who will be working with your code. adapting it and so on. We should not force them to make _modifications_, instead we must allow them to _extend_ what's already written.

**Ways to extend an abstraction**

- Inheritance
- Composition
- Configuration

```javascript
// Good! (An example of extension with inheritance)
class Event {
 renderNotification() {
    return `
      You have an event occurring in
      ${this.calcMinutesUntil()} minutes!
    `;
  }
 // ...
}

class ImportantEvent extends Event {
  renderNotification() {
    return `Urgent! ${super.renderNotification()}`;
  }
}
```

We are prefixing our urgent message by overriding the `renderNotification` method and calling the super class's `renderNotification` to fill in the remainder of the notification string. Therefore, extension by inheritance

```javascript
// Good! (An example of extension with configuration)
class Event {
 renderNotification() {
    const defaultNotification = `
      You have an event occurring in
      ${this.calcMinutesUntil()} minutes!
    `;
    return (
      this.config.renderCustomNotification
        ? this.config.renderCustomNotification(defaultNotification)
        : defaultNotification
    );
  }
 // ...
}

new Event({
  title: 'Doctor Appointment',
  config: {
    renderCustomNotification: defaultNotification => {
      return `Urgent! ${defaultNotifcation}`;
    }
  }
});
```

We are providing our custom `renderNotification` method in a configuration object to `Event`. If it is passed, it is invoked by passing the default notification to it. Else, the default notification is rendered.

**NOTE**

It is impossible to foresee all types of extensions.

### An explanation of Open/Closed Principle with specifiers and combinators

OCP: "Open for extension, Closed for modification". OCP provides us with _Modularity (separation of concerns)_

**When is code change considered a modification?**

When you edit a class to add, delete or update methods or properties. Other consumers might already be using this class and they might not need additional functionality. In a worse case, the functionality they depended upon has changed.

**Why are modifications bad?**

- They add to state space explosion. Your class signature keeps changing and eventually becomes a _GOD object_ that controls everything
- GOD objects are bad because they become increasingly complex
- Hence, it is not _maintainable_ nor _scalable_

```javascript
// Bad!
class Product {
  constructor(color, size) {
    this.color = color
    this.size = size
  }
}

// The class in question
class ProductFilter {
  // Existing method
  filterByColor(products) {

  }

  // Additional requirement has come in: filter by size!
  filterBySize(products) {
    // Added later
  }

  // One more requirement: filter by color and size!
  filterByColorAndSize(products) {
    // Added muchhh laterrr!
  }

  // More requirements keep coming
  // ...
  // state space explosion!
}
```

**What code change results in an extension?**

Typically means ***inheritance***. But, we can also have a combination of specifiers, combinators, and inheritance from abstract classes.

**Specification pattern**

It is a pattern where you remove the hardcoded criteria from an original class and create a _separate class for a criteria_ with its own methods.

Objects of these specifiers are passed down to the methods of the original class. In this way, we don't have to modify the original class itself when new specifications (criteria) arises. 

We can create new specification classes for more criteria, when the need arises, and change what is passed to the original class' method

**Combinator pattern**

Sometimes you may need to combine one or more specifications (criteria) so you create a class (again) to combine multiple specifications and pass this compound specification to the original class' method.

Combinators deal only with creating combinations of specifications (SRP)

Specifiers, combinators, and now the original function follow SRP (& thereby separation of concerns) and can be extended easily (by creating more of each)

Note that _combinators are also specifiers_, just a compound type.

```javascript
// Good!
class Product {
  constructor(color, size) {
    this.color = color
    this.size = size
  }
}

// Original class in question:
class ProductFilter {
  filter(products, specification) {
    return products.filter(product => specification.isSatisfied(product))
  }
}

// Specifiers:

class ColorSpecification {
  constructor(color) {
    this.color = color
  }

  isSatisfied(product) {
    return this.color === product.color
  }
}

class SizeSpecification {
  constructor(size) {
    this.size = size
  }

  isSatisfied(product) {
    return this.size === product.size
  }
}

// Combinators:

class AndSpecification {
  constructor(...specifications) {
    this.specifications = specifications
  }

  isSatisfied(product) {
    return this.specifications.every(specification => specification.isSatisfied(product))
  } 
}

class OrSpecification {
  constructor(...specifications) {
    this.specifications = specifications
  }

  isSatisfied(product) {
    return this.specifications.some(specification => specification.isSatisfied(product))
  }
}

// Usage:

const bike = new Product('green', 'heavy')
const car = new Product('blue', 'heavy')
const scooty = new Product('yellow', 'medium')
const cycle = new Product('green', 'light')
const products = [bike, car, scooty, cycle]

const greenSpecification = new ColorSpecification('green')
const lightSpecification = new SizeSpecification('light')
const greenAndLightSpecification = new AndSpecification(
  greenSpecification, 
  lightSpecification
)
const greenOrLightSpecification = new OrSpecification(
  greenSpecification, 
  lightSpecification
)

const productFilter = new ProductFilter()
productFilter.filter(products, greenAndLightSpecification)
// [ Product { color: 'green', size: 'light' } ]

productFilter.filter(products, greenOrLightSpecification)
// [
//   Product { color: 'green', size: 'heavy' },
//   Product { color: 'green', size: 'light' }
// ]

// Note: 

/* An abstract class for a specifier can be like so: 
class Specification { 
  constructor() {
    if (this.constructor.name === 'Specification') {
      throw new Error('Cannot instantiate abstract class')
    }
  }
  isSatisfied() {}
} */
```

We can have one **"abstract class"** as base class for a specifier or combinator to inherit from as the abstract class provides an interface but has no implementation itself! However, in Javascript we do not have abstract classes natively.

In Javascript:
- Not implementing a method of an abstract class throws no error (Just a no-op)
- Abstract classes can be instantiated (Although we can throw an error in constructor for it)

Therefore, it is better to use _"duck typing"_ in the method that consumes a specifier / combinator. Mantra: "If it walks like a specifier and quacks like one too, it must be a specifier"

**Exceptions: When is modification okay?**

When you have no choice but to make it. For example, there is a bug in one of the methods.

We should be careful not to break the existing contract between the class and consumer of this class. Also be careful if the class has already gone to production (live) earlier.

### Having an eye for OCP (avoiding violations)

1. An `if-else` or `switch` statement. Ask yourself, "Will more cases need to be added in future?".
  - In such a scenario, instead of cases, passing of the type to the entity might be better
  - That is, is extension possible by passing any type of _configuration_ object?
    - We can also write our class so that config object data can override to the default methods.
  - Decision making is sent up a level i.e During method invocation and not inside the method itself!
2. Is the base class we are inheriting from abstract enough? (`Shape/Rectangle/Square` example above)
  - Make sure the abstraction's inheritance mechanism is extensible and not faulty!
  - i.e Extension by inheritance must not have to modify abstract class / employ other workarounds
3. Too many methods in a class that have similar functionality
  - For example, the `ProductFilter` example above where
  - We can have specifiers and combinators in this case

## 3. Liskov Substitution Principle (LSP)

This is a scary term for a very simple concept. It's formally defined as **"If S is a subtype of T, then objects of type T may be replaced with objects of type S (i.e., objects of type S may substitute objects of type T) without altering any of the desirable properties of that program (correctness, task performed, etc.)."** That's an even scarier definition.

The best explanation for this is **if you have a parent class and a child class, then the base class and child class can be used interchangeably without getting incorrect results**. This might still be confusing, so let's take a look at the classic Square-Rectangle example. Mathematically, a square is a rectangle, but if you model it using the "is-a" relationship via inheritance, you quickly get into trouble.

```javascript
// Bad!
class Rectangle {
  constructor() {
    this.width = 0;
    this.height = 0;
  }

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width;
  }

  setHeight(height) {
    this.width = height;
    this.height = height;
  }
}

function renderLargeRectangles(rectangles) {
  rectangles.forEach(rectangle => {
    rectangle.setWidth(4);
    rectangle.setHeight(5);
    const area = rectangle.getArea(); // BAD: Returns 25 for Square. Should be 20.
    rectangle.render(area);
  });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
```

```javascript
// Good!
class Shape {
  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(length) {
    super();
    this.length = length;
  }

  getArea() {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes) {
  shapes.forEach(shape => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

**Another example**

This means that the child class must implement everything that’s in the parent class. The parent class has the base members that child classes extend from.

**Alternate explanation**

"A consumer of a type should only be concerned with the least specific type necessary to operate it reliably". Types should be able to be replaced by their subtypes without altering the reliability of the program.

```javascript
// Good!
class ImportantEvent extends Event {
  renderNotification() {
    return `Urgent! ${super.renderNotification()}`;
  }
}

class Event {
  renderNotification() {
    return "Some notification message";
  }
}

class Calendar {
  getEventsWithinMinutes(minutes) {
    return this.events.filter(event => {
      return event.startsWithinMinutes(minutes);
    });
  }
  notifiyUpcomingEvents() {
    this.getEventsWithinMinutes(10).forEach(event => {
      this.sendNotification(
        event.renderNotification()
      );
    });
  }
 // ...
}
```

The `Calendar` class (consumer) deals with events. However, it need not care "what type of event" it is dealing with from its perspective. It only needs know that it can notify its user what the upcoming events are and so on. Therefore, the `ImportantEvent` class is expected to have a `renderNotification` method just like the base `Event` class.

**The tenet of clean code that LSP emphasizes**

_MAINTAINABILITY_ since it is closely linked to LoD (Law of Demeter)

The question we need to ask with respect to LSP is: _What is the least information that this abstraction requires in order to fulfill its purpose?_

## 4. Interface Segregation Principle (ISP)

JavaScript doesn't have interfaces so this principle doesn't apply as strictly as others. However, it's important and relevant even with JavaScript's lack of type system.

ISP states that "Clients should not be forced to depend upon interfaces that they do not use." Interfaces are implicit contracts in JavaScript because of duck typing.

A good example to look at that demonstrates this principle in JavaScript is for **classes that require large settings objects**. **Not requiring clients to setup huge amounts of options is beneficial**, because most of the time they won't need all of the settings. Making them **optional** helps prevent having a "fat interface".

```javascript
// Bad!
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.settings.animationModule.setup();
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName("body"),
  animationModule() {} // Most of the time, we won't need to animate when traversing.
  // ...
});
```

```javascript
// Good!
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.options = settings.options;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.setupOptions();
  }

  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName("body"),
  options: {
    animationModule() {}
  }
});
```

**Alternate explanation**

ISP is closely linked to SRP: Cohesive, focused abstractoins

The approach is slightly different though. instead of making you consider the concept of responsibility itself, it makes you look at the interfaces that you're creating and consider whether they're appropriately segregated.

**Benefits of ISP**

- RELIABILITY: Having properly isolated interfaces that are truly decoupled makes code easier to test and verify, thereby aiding its general reliability and stability over time.
- MAINTAINABILITY: Having segregated interfaces means that changes to one needn't affect the others
- USABILITY: Having interfaces that are separated according to their purpose and function means that users are able to understand and navigate the interfaces with far less time and cognitive effort. The users are the consumers of our interfaces, and so are the most dependent on the interfaces being clearly delineated.

## 5. Dependency Inversion Principle (DIP)

This principle states two essential things:

- High-level modules should not depend on low-level modules. Both should depend on abstractions (that is, interfaces) 
- Abstractions should not depend on details. Details (such as concrete implementations) should depend on abstractions

This can be hard to understand at first, but if you've worked with AngularJS, you've seen an implementation of this principle in the form of Dependency Injection (DI). While they are not identical concepts, DIP keeps high-level modules from knowing the details of its low-level modules and setting them up. It can accomplish this through DI. A huge benefit of this is that it reduces the coupling between modules. Coupling is a very bad development pattern because it makes your code hard to refactor.

As stated previously, **JavaScript doesn't have interfaces so the abstractions that are depended upon are implicit contracts. That is to say, the methods and properties that an object/class exposes to another object/class**. In the example below, the implicit contract is that any Request module for an `InventoryTracker` will have a `requestItems` method.

```javascript
// Bad!
class InventoryRequester {
  constructor() {
    this.REQ_METHODS = ["HTTP"];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryTracker {
  constructor(items) {
    this.items = items;

    // BAD: We have created a dependency on a specific request implementation.
    // We should just have requestItems depend on a request method: `request`
    this.requester = new InventoryRequester();
  }

  requestItems() {
    this.items.forEach(item => {
      this.requester.requestItem(item);
    });
  }
}

const inventoryTracker = new InventoryTracker(["apples", "bananas"]);
inventoryTracker.requestItems();
```

```javascript
// Good!
class InventoryTracker {
  constructor(items, requester) {
    this.items = items;
    this.requester = requester;
  }

  requestItems() {
    this.items.forEach(item => {
      this.requester.requestItem(item);
    });
  }
}

class InventoryRequesterV1 {
  constructor() {
    this.REQ_METHODS = ["HTTP"];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryRequesterV2 {
  constructor() {
    this.REQ_METHODS = ["WS"];
  }

  requestItem(item) {
    // ...
  }
}

// By constructing our dependencies externally and injecting them, we can easily
// substitute our request module for a fancy new one that uses WebSockets.
const inventoryTracker = new InventoryTracker(
  ["apples", "bananas"],
  new InventoryRequesterV2()
);
inventoryTracker.requestItems();
```

**Another example**

We shouldn’t have to know any implementation details of our dependencies. If we do, then we violated this principle.

We need this principle because if we do have to reference the code for the implementation details of a dependency to use it, then when the dependency changes, there’s going to be lots of breaking changes to our own code.

As software gets more complex, if we don’t follow this principle, then our code will break a lot.

One example of hiding implementation details from the code that we implement is the facade pattern. The pattern puts a facade class in front of the complex implementation underneath so we only have to depend on the facade to use the features underneath.

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

We don’t have to worry about `ClassA`, `ClassB` and `ClassC` to implement the `Foo` class. As long as the Facade class doesn’t change, we don’t have to change our own code.

**Extended explanation**

1. High-level modules should not depend on low-level modules. 
  - This can be thought of as Law of Demeter (LoD) where we concern ourselves with least knowledge and separation of high level from low level. 
  - Our abstractions should be separated (decoupled) in such a way that we can easily change low-level implementation details at a later date without having to refactor all of our code.

2. Both should depend on abstractions (that is, interfaces). Abstractions should not depend on details. Details (such as concrete implementations) should depend on abstractions
  - The dependency inversion principle, in its second point, suggests that we do this via **intermediary abstractions** through which the high-level modules can *interface* with the low-level details. These intermediary abstractions are sometimes known as **adapters**, as they _adapt a low-level abstraction for consumption by a high-level abstraction_.

The dependency inversion principle asks us to consider how we can abstract away low level concerns to an intermediary abstraction that acts as a bridge between high-level and low-level.

```javascript
// Bad!
class Calendar {
  getEventsAtLocation(targetLocation, kilometerRadius) {
    const geocoder = new GeoCoder();
    const distanceCalc = new DistanceCalculator();
    
    return this.events.filter(event => {
      const eventLocation = event.location.address
        ? geocoder.geocode(event.location.address)
        : event.location.coords;
      return distanceCalc.haversineFormulaDistance(
        eventLocation,
        targetLocation
      ) / 1000;
    });
  }
  // ... 
}
```

The `Calendar` class is a high-level abstraction, concerned with the broad concepts of a calendar and its events. The `getEventsAtLocation` method, however, contains a lot of location-related details that are more of a low-level concern.

```javascript
// Good!
const distanceCalculator = new DistanceCalculator();
const geocoder = new GeoCoder();
const METRES_IN_KM = 1000;

class EventLocationCalculator {
  constructor(event) {
    this.event = event;
  }
 getCoords() {
    return this.event.location.address
      ? geocoder.geocode(this.event.location.address)
      : this.event.location.coords
  }
 calculateDistanceInKilometers(targetLocation) {
    return distanceCalculator.haversineFormulaDistance(
      this.getCoords(),
      targetLocation
    ) / METRES_IN_KM;
  }
}

class Event {
 constructor() {
    // ...
    this.locationCalculator = new EventLocationCalculator();
  }
   isEventWithinRadiusOf(targetLocation, kilometerRadius) {
    return locationCalculator.calculateDistanceInKilometers(
      targetLocation
    ) <= kilometerRadius;
  }
  // ...
}

class Calendar {
   getEventsAtLocation(targetLocation, kilometerRadius) {
    return this.events.filter(event => {
      return event.isEventWithinRadiusOf(
        targetLocation,
        kilometerRadius
      );
    });
  }
  // ...
}
```

**NOTE**

The dependency inversion principle is similar to other principles that are related to the delineation of abstractions, such as the interface segregation principle, but is specifically concerned with dependencies and how these dependencies are directed. As we design and build abstractions, we are, implicitly, setting up a **"dependency graph"** (For example, `Calendar` depends on `Event` which depends on `EventLocationCalculator` which depends on two things: `DistanceCalculator` and `GeoCoder`).

**Dependency graph** lets us observe where, if anywhere, our low-level implementations (details) impact our high-level abstractions. 