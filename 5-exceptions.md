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