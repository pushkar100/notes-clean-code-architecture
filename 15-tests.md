# Tests

## 1. Have sufficient tests by using a coverage tool

Test coverage tools tell us what we have tests for and what still needs test coverage. They also tell us which branches of our code have test coverage.

- Boundary and edge cases should also have tests to test cases that may break our code.
- Tests should take into account both positive and negative cases

## 2. Don’t Skip Trivial Tests

They’re easy to write and serves as good documentation.

## 3. Tests Should be Fast

Slow tests are torture to run. They just get ignored and won’t get run. We should make them as fast as possible, especially since there’s going to be lots of them.

## 4. Exhaustively Test Near Bugs

If a piece of code has bugs, then we should test those cases more.

## 5. Test Boundary Conditions

Testing boundary conditions is important since code often breaks around boundary conditions.
