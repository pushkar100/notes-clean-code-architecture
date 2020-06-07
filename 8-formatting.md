# Formatting

For things that don't fall under the purview of automatic formatting (indentation, tabs vs. spaces, double vs. single quotes, etc.) look here for some guidance.

## 1. Use consistent capitalization

Capitalization is used for a lot of things. Especially since javascript is untyped, we can use it to define different types of data - for example: Using names for constants and magic numbers or strings.

```javascript
// Bad
const DAYS_IN_WEEK = 7;
const daysInMonth = 30;

const songs = ["Back In Black", "Stairway to Heaven", "Hey Jude"];
const Artists = ["ACDC", "Led Zeppelin", "The Beatles"];

function eraseDatabase() {}
function restore_database() {}

class animal {}
class Alpaca {}

// Good!
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;

const SONGS = ["Back In Black", "Stairway to Heaven", "Hey Jude"];
const ARTISTS = ["ACDC", "Led Zeppelin", "The Beatles"];

function eraseDatabase() {}
function restoreDatabase() {}

class Animal {}
class Alpaca {}
```

## 2. Function callers and callees should be close

If a function calls another, keep those functions vertically close in the source file. Ideally, keep the caller right above the callee. We tend to read code from top-to-bottom, like a newspaper. Because of this, make your code read that way.

The high-level concepts are important, so they should be on top, then we can look at the lower level helper functions. This creates a nice flow from high to a low level

```javascript
// Bad!
class PerformanceReview {
  constructor(employee) {
    this.employee = employee;
  }

  lookupPeers() {
    return db.lookup(this.employee, "peers");
  }

  lookupManager() {
    return db.lookup(this.employee, "manager");
  }

  getPeerReviews() {
    const peers = this.lookupPeers();
    // ...
  }

  perfReview() {
    this.getPeerReviews();
    this.getManagerReview();
    this.getSelfReview();
  }

  getManagerReview() {
    const manager = this.lookupManager();
  }

  getSelfReview() {
    // ...
  }
}

const review = new PerformanceReview(employee);
review.perfReview();
```

```javascript
// Good!
class PerformanceReview {
  constructor(employee) {
    this.employee = employee;
  }

  // GOOD: Caller above callees:
  perfReview() {
    this.getPeerReviews();
    this.getManagerReview();
    this.getSelfReview();
  }

  getPeerReviews() {
    const peers = this.lookupPeers();
    // ...
  }

  lookupPeers() {
    return db.lookup(this.employee, "peers");
  }

  getManagerReview() {
    const manager = this.lookupManager();
  }

  lookupManager() {
    return db.lookup(this.employee, "manager");
  }

  getSelfReview() {
    // ...
  }
}

const review = new PerformanceReview(employee);
review.perfReview();
```

## 3. Maintain smaller files

Smaller files are easier to understand than big files. Big files take longer to read and so more time is spent reading code and than doing the actual work.

**The number of lines of code is should be less than 500 lines.**

Source code is like a newspaper article. The farther down we go, the more detailed the article gets. This is the same for code. We have an introduction with declarations of variables and functions and then as we get lower, we get more implementation details of the code.

## 4. Use blank lines between entities

Blank lines are important between different entitles.

They’re especially important between functions and class definitions. Without them, everything becomes hard to read and frustrates readers.

```javascript
// Bad!
class Foo { 
  method1(){} 
  method2(){}
}
class Bar { 
  method1(){} 
  method2(){}
}
```

```javascript
// Good!
class Foo {
  method1() {}

  method2() {}
}
class Bar {
  method1() {}

  method2() {}
}
```

It’s hard to focus on a section of code when they’re all bunched together.

**Note:**

**Variable declarations** can be bunched together. Not a problem - it can be treated as a collective entity (i.e a declaration set). However, between this set and other entities, leave a blank space

```javascript
// Good!
let x = 1;
let y = 2;

class Foo { /* ... */ }
```

## 5. Keep variable declarations as close to their usage as possible

The reason is that their usage can be found quickly without scrolling around or jumping through different files.

**Example:** Loop control variables should be declared within the loop statement so that readers will know right away that it’s used in the loop.

```javascript
// Bad!
var timer;
// ...
// ...
// ...
// ...
// ... A long list of things ...
// ...
// ...
// ...
function setTimer(value) {
  timer = setTimeout(() => {}, value)
}

// Good!
var timer;
// ... Closer to the function ...
function setTimer(value) {
  timer = setTimeout(() => {}, value)
}
```

