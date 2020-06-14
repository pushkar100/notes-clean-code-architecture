# Exceptions

Exceptions should be used to deal with uncontrolled or developed situations in our software and never as a way to simulate a "return" of our business logic to derive the flow of software in one direction or another.

## 1. Prefer Exceptions to Returning Error Codes

Use exceptions better than error codes when the programming language has exception handling.

**Reason:**

Using exceptions will produce a much cleaner code than having to manage error codes in the code itself.
Without exceptions, the management of uncontrolled cases must be carried out manually (Ex: through the "if" statement)

**Advantages of exceptions**

1. Uncoupled business logic and error control
2. Less verbosity in the code and easier to read
3. The responsibility for the error code has been delegated to the programming language, which must be at our service and not vice versa

```javascript
// Dirty
class Laptop {
  sendShutDown() {
    const deviceID = getID(DEVICE_LAPTOP);
    if (deviceID !== DEVICE_STATUS.INVALID) {
      const laptop = DB.findOne(deviceID);

      if (laptop.getStatus() !== DEVICE_SUSPENDED) {
        pauseDevice(deviceID);
        clearDeviceWorkQueue(deviceID);
        closeDevice(deviceID);
      } else {
        logger.log('Device suspended. Unable to shut down');
      }
    } else {
      logger.log('Invalid handle for: ' + DEVICE_LAPTOP.toString());
    }
  }
}
```

```javascript
// Clean
/* 
   The code is better because the algorithm 
   and error handling, are now separated. 
*/
class Laptop {
  sendShutDown() {
    try {
      tryToShutDown();
    } catch (error) {
      logger.log(error);
    }
  }
  tryToShutDown() {
    const deviceID = getID(DEVICE_LAPTOP);
    const laptop = DB.findOne(deviceID);
    pauseDevice(deviceID);
    clearDeviceWorkQueue(deviceID);
    closeDevice(deviceID);
  }
  getID(deviceID) {
    throw new DeviceShutDownError('Invalid handle for: ' + deviceID.toString());
  }
}
```

**Another example**

Throwing exceptions is better because they let us know that an error exists and that we have to handle it.

Most modern programming languages have exceptions built-in, so we should throw them instead of returning an error code.

Error codes aren’t as explicit and may be missed. Exceptions are also much cleaner since we don’t have to check all the codes that may be returned.

For example, if we return error codes in our functions then we may have code that looks something like this:

```javascript
// Bad!
const LESS_THAN_ZERO = 'LESS_THAN_ZERO';
const TOO_MANY = 'TOO_MANY';
const NOT_A_NUMBER = 'NOT_A_NUMBER';
class FruitStand {
  setNumFruit(numFruits) {
    if (typeof numFruits !== 'number') {
      return NOT_A_NUMBER;
    }
    if (numFruits < 0) {
      return LESS_THAN_ZERO;
    }
    if (numFruits > 100) {
      return TOO_MANY;
    }
    this.numFruits = numFruits;
  }
}
const fruitStand = new FruitStand();
const error = fruitStand.setNumFruit(1);
if (error !== LESS_THAN_ZERO && error !== TOO_MANY && error !== NOT_A_NUMBER) {
  console.log(fruitStand.numFruits);
}
```

We have to return all the error codes in our `setNumFruit` method. Also, before we do something after the class definition, we have to check all the error codes.

We can throw exceptions instead:

```javascript
// Good!
const LESS_THAN_ZERO = 'LESS_THAN_ZERO';
const TOO_MANY = 'TOO_MANY';
const NOT_A_NUMBER = 'NOT_A_NUMBER';
class FruitStand {
  setNumFruit(numFruits) {
    if (typeof numFruits !== 'number') {
      throw new Error(NOT_A_NUMBER);
    }
    if (numFruits < 0) {
      throw new Error(LESS_THAN_ZERO);
    }
    if (numFruits > 100) {
      throw new Error(TOO_MANY);
    }
    this.numFruits = numFruits;
  }
}
const fruitStand = new FruitStand();
try {
  const error = fruitStand.setNumFruit(1);
  console.log(fruitStand.numFruits);
} catch (ex) {
  console.error(ex);
}
```

We’ve eliminated the need to check all the error codes by wrapping the code we want to run in a `try` block. Now we can just catch the error instead of checking all the error codes that may be returned.

This is much better than checking all error codes before doing something — it’s especially important as code becomes more complex!

## 2. Don't ignore caught error!

The **ostrich technique** consists of hiding the head under the earth and that is what we do every time we have an error management where we do absolutely nothing

It is very important that you learn that doing a `console.log`, or `system.out.println` about an error means **NOT** doing anything

Therefore, do not ignore the management of an exception, the exceptions are caused by an unexpected circumstance and must be treated properly.

```javascript
// Bad!
try {
  functionThatMightThrow();
} catch (error) {
  console.log(error);
}

// Good!
try {
  functionThatMightThrow();
} catch (error){
  console.error(error);
  notifyUserOfError(error);
  reportErrorToService(error);
}
```

## 3. Don't ignore rejected promises

Similar to uncaught errors, we must not ignore this rejection.

The promises can be rejected (not that it is a mistake itself) and therefore we have to manage them as if they were mistakes

```javascript
// Bad! Just console logging it
getData() 
  .then(data => functionThatMightThrow(data))
  .catch(error => console.log);

// Good!
getData()
  .then(data => functionThatMightThrow(data))
  .catch(error => {
    console.log(error);
    notifyUserOfError(error);
    reportErrorToService(error);
});
```

## 4. Exceptions Hierarchy

Create a hierarchy of exceptions. We have to create our own hierarchy of exceptions that speaks of our business logic and that triggers when an unexpected situation occurs in our business logic

**Note:**

Low level exceptions provided by the language are not very helpful (Ex: NullPointerException, ArrayIndexOutOfBoundsException, etc). These do not talk about business logic!

We want our code to model our business logic. Therefore, we have to create our own hierarchy of exceptions that speaks of our business logic

```javascript
// Good!
export class UserException extends Error {
  constructor(message) {
    super(`User: ${mesage}`);
   }
}

export class AdminException extends Error {
  constructor(message) {
    super(`Admin: ${message}`);
  }
}

// Client code
const id = 1;
const user = this.users.find({ id });
if(user){
  throw new UserException('This user already exists');
}
```

## 5. Provide context with exceptions

Normally, a message is added explaining the intention of the operation that failed in our software. 

It should be noted that this information we provide should not be what the end user sees since we should properly manage the exception for that so these codes are not shown in the user interface but something more usable for them.

```javascript
// Bad!
throw new UserException();
throw new UserException('UserException');

// Good!
throw new UserException('This user already exists');
```

## 6. Use `Try-Catch-Finally`

We should wrap our `try` in the code that throws exceptions that we want to catch. It creates its own scope for block-scoped variables so anything declared with `let` or `const` can only be referenced in the `try` block.

Variables declared with `var` are hoisted so that they can be referenced outside the block. We won’t get an error even if they’re referenced outside the block. 

The `finally` statement lets you execute code, after try and catch, regardless of the result.

**Note:** The catch and finally statements are both optional, but you need to use one of them (if not both) while using the try statement.

This will get us`1`:

```javascript
try {
  let x = 1;
} catch (ex) {
  console.error(ex);
}
console.log(x);
```

But this will get us `Uncaught ReferenceError: x is not defined`:

```javascript
try {
  let x = 1;
} catch (ex) {
  console.error(ex);
}
console.log(x);
```

```javascript
try {
  // tryCode - Block of code to try
}
catch(err) {
  // catchCode - Block of code to handle errors
}
finally {
  // finallyCode - Block of code to be executed regardless of the try / catch result
}
```

## 7. Extend the Error class for semantically meaningful errors

Excerpt from "Clean Code in JavaScript - Padolsey, James":

> JavaScript will naturally raise such exceptions to you if you misuse native APIs or produce invalid syntax, but you can also use these constructors yourself to provide more semantically meaningful errors to your fellow programmers. If none of the preceding are suitable, then you can directly use Error or extend from it to produce your own specialized instance, as follows: `class NetworkError extends Error {}`

```javascript
// Good!
async function makeDataRequest() {
  let response
  try {
    response = await fetch('/data');
  } catch(e) {
    throw NetworkError('Cannot fetch data');
  }
  // ... (process response) ...
}
```

There may be unique situations where you wish to throw a value that is not an Error instance, and technically, this is perfectly legal, but it is rarely useful to do so. It's best to only throw in the case of an actual error, and in that case, it is best to use an appropriate Error object to represent the error.