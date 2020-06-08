# Testing 

Testing is more important than shipping. If you have no tests or an inadequate amount, then every time you ship code you won't be sure that you didn't break anything. Deciding on what constitutes an adequate amount is up to your team, but having 100% coverage (all statements and branches) is how you achieve very high confidence and developer peace of mind. This means that in addition to having a great testing framework, you also need to use a good coverage tool.

There's no excuse to not write tests. There are plenty of good JS test frameworks, so find one that your team prefers. When you find one that works for your team, then aim to always write tests for every new feature/module you introduce. If your preferred method is Test Driven Development (TDD), that is great, but the main point is to just make sure you are reaching your coverage goals before launching any feature, or refactoring an existing one.

## 1. Single concept per test

```javascript
// Bad!
import assert from "assert";

describe("MomentJS", () => {
  it("handles date boundaries", () => {
    let date;

    date = new MomentJS("1/1/2015");
    date.addDays(30);
    assert.equal("1/31/2015", date);

    date = new MomentJS("2/1/2016");
    date.addDays(28);
    assert.equal("02/29/2016", date);

    date = new MomentJS("2/1/2015");
    date.addDays(28);
    assert.equal("03/01/2015", date);
  });
});
```

```javascript
// Good!
import assert from "assert";

describe("MomentJS", () => {
  it("handles 30-day months", () => {
    const date = new MomentJS("1/1/2015");
    date.addDays(30);
    assert.equal("1/31/2015", date);
  });

  it("handles leap year", () => {
    const date = new MomentJS("2/1/2016");
    date.addDays(28);
    assert.equal("02/29/2016", date);
  });

  it("handles non-leap year", () => {
    const date = new MomentJS("2/1/2015");
    date.addDays(28);
    assert.equal("03/01/2015", date);
  });
});
```

## 2. Have sufficient tests by using a coverage tool

Test coverage tools tell us what we have tests for and what still needs test coverage. They also tell us which branches of our code have test coverage.

- Boundary and edge cases should also have tests to test cases that may break our code.
- Tests should take into account both positive and negative cases

## 3. Don’t Skip Trivial Tests

They’re easy to write and serves as good documentation.

## 4. Tests Should be Fast

Slow tests are torture to run. They just get ignored and won’t get run. We should make them as fast as possible, especially since there’s going to be lots of them.

## 5. Exhaustively Test Near Bugs

If a piece of code has bugs, then we should test those cases more.

## 6. Test Boundary Conditions

Testing boundary conditions is important since code often breaks around boundary conditions.

## 7. Use Test Driven Development (TDD)

There’re 3 principles of TDD:

- We may not write production code until we’ve written some failing unit tests.
- We only write a test that fails and not makes compilation fail.
- We write production code to make the failing test pass.

This means that the **test and code are written together**. The result is that we write dozens of tests every day and test coverage would be comprehensive

## 8. Write clean tests

Test code should be kept to the same quality as normal production code. This way, it’ll be easy to maintain the test

Things like naming things properly, creating functions that aren’t too long, formatting, etc., all apply to unit tests just as much as production code. This makes tests easy to maintain so people can move on to writing production code

