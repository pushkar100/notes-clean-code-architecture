# Variables

## 1. Use intention revealing names

Variable names must reveal the intention of that variable. For example, do not use mathematical variables such as `x` and `y`.

**Drawbacks of bad names:**

1. Does not reveal the intention
2. Information is usually supplemented by (an unnecessary) comment during declaration or usage

```javascript
// Bad!
const x

// Still bad even with a comment!
const x // This refers to the user information

// Good!
const user
```

## 2. Use pronounceable names

In order to reveal the intention of the variable, one must be able to read it without much effort. Do not make me think about matters that are not the focus of my business logic

**Dont's:**

1. You should not invent acronyms
2. Do not apply diminutives by removing letters from a word. For example, do not take a 5 letter, pronounceable word and make it 3 letters.

Transpilers and uglifiers take care of mangling the names for better performance, humans need not do that!

```javascript
// Bad! requires mental effort
class DtaRcrd102 {
  private Date genymdhms;
  private Date modymdhms;
}

// Still bad! acronyms are not preferred
class DR102 {
  private Date Gymdhms;
  private Date Mymdhms;
}

// Good! Readable, unmangled names
class Customer {
  private Date generationTimestamp;
  private Date modificationTimestamp;
}
```

## 3. Don’t use the variable’s type in the name

We should leave type information to the type system of the language or a type-checker such as Typescript or Flow.

**Reasons:**

1. Why do I want the typing system of a programming language if I am using it in the name of the variable?
2. What happens if I have to modify the type of data from an array to a set or a map?
3. What does that type prefix give me? Is it pronounceable?
4. We are revealing in the name of the variable a concrete implementation and it is coupling us to a type of data.

```javascript
// Bad! Too much "noise" with a prefix! (a: array, s: string, d: amount)
const aCountries = [] 
const sName = ‘’
const dAmount = 3.2;

// Good! Still easy to read and understand without type prefix
const countries = [] 
const name = ‘’
const amount = 3.2;
```

## 4. Use the same vocabulary for the same variable’s type

For the same entity, do not refer to it by different names. For example, one team might refer to `user` while the other might refer to the same thing as `client`. This adds confusion and can even happen when only one developer is coding it.

It is better to settle down on the same terminology between the developers at the beginning of the project. Type checkers and documentation tools can be used to explicitly define the name of an entity and its contents and pass this definition around.

```javascript
// Bad! Using different names to retrieve the same type of data from different places
getUserInfo();
getClientData();
getCustomerRecord();

// Good!
getUser();
```

## 5. Don’t add unneeded context

It is not necessary to add context of the class or package in the definition of the name of a variable.

It is very common that context is added in the name of the variable to know in which workspace this variable is located. This is not necessary - causes noise and redundancy!

```javascript
// Bad! not necessary to add context to every prop & method
const Car = {
  carMake: ‘Honda’,
  carModel: ‘Accord’,
  carColor: ‘Blue’
};

function paintCar(car) {
  car.carColor = ‘Red’;
}

// Good! clearly understood
const Car = {
  make: ‘Honda’,
  model: ‘Accord’,
  color: ‘Blue’
};

function paint(car) {
  car.color = ‘Red’;
}
```

## 6. Don’t use magic number and strings

NEVER have numbers and text strings written in the source code (*hardcode*) that have a value! These are referred to as magic numbers or magic chains.

**Reasons:**

1. What does that number mean?
2. Do we have to decipher it? Again, it's mental effort to be spent!

**Solution:**

Those magic numbers or chains must be frequently stored in constants which receive a name that specifies the intentionality of that magic number.

```javascript
// Bad! Magic number and magic string
// What the heck is 86400000 for?
setTimeout(blastOff, 86400000);
user.rol = “Administrator”;

// Good! Giving them meaning
const MILLISECONDS_IN_A_DAY = 86400000;
const ADMINISTRATOR_ROL = “Administrator”;

setTimeout(blastOff, MILLISECONDS_IN_A_DAY);
user.rol = ADMINISTRATOR_ROL;
```

## Conclusion

Software application that will be maintained over a considerable time or will be developed by several developers, it is when we will have the need to read and reread our source code. At this time, the name we assign to our variables will give us a touch of quality and clean code.