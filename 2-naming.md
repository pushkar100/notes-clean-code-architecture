# Variables

## 1. Use intention revealing names

Variable names must reveal the intention of that variable. For example, do not use mathematical variables such as `x` and `y`.

We should name things by what they mean!

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

```javascript
// Bad!
let list = [];

// Good!
let fruits = [];
```

```javascript
// Bad!
locations.forEach(l => {
  doSomething();
  // ...
  // ...
  createMap(l); // What is `l` again?
})

// Good!
locations.forEach(location => {
  doSomething();
  // ...
  // ...
  createMap(location);
})
```

**No generic names! Only meaningful context**

```javascript
// Bad!
let num = 5; // Number of what??
let modifier;
let number;

// Good!
let numFruits = 5; // instead of num
let passwordModifier; // instead of modifier
let userID; // instead of number

// Good!
// More on meaningful context inside names:
let numberOfItems = 1;
let pluralModifier = numberOfItems ? '' : 's';
let numItemsString = `${numberOfItems} item${pluralModifier}`;
```

**Names Should Describe Side Effects**

If the scope is long then the name should be longer than if they’re in a short scope. Variables with short names lose their meaning over long distances.

```javascript
let foo;

// Bad!
const getFoo = () => {
  if (!foo) {
    foo = {}
  }
  return foo
}

// Good!
const setFooIfNotExistAndGetFoo = () => {
  if (!foo) {
    foo = {}
  }
  return foo
}
```

**Names having 'data' keyword might add redundancy**

This is subjective. Sometimes, having `data` might make sense. At other times, it is just extra letters without adding more meaning

```javascript
// Bad!
getUserData()

// Good!
getUser() // We implicitly know that getting user means getting the user's data
```

**Avoid too many index lookups: Assign them to names instead**

`foo.bar[i]`, `dataFromApi[4]`, etc are harder to read when compared to single variables. Combine them with conditionals or loops and they become more convoluted a structure to decipher mentally

They also do not reveal their intention (Ex: What type of data is the 4th index supposed to be?)


```javascript
// Bad!
const cityStateRegex = /\.\.\./;
saveCityStateRegex(cityState.match(cityStateRegex)[0], cityState.match(cityStateRegex)[1]);

// Good!
const cityStateRegex = /\.\.\./;
const match = cityState.match(cityStateRegex);
const city = match[0];
const state = match[1];
saveCityStateRegex(city, state);
```

## 2. Use pronounceable names

In order to reveal the intention of the variable, one must be able to read it without much effort. Do not make me think about matters that are not the focus of my business logic

Another way to think about them are by considering them to be **"Searchable Names"**. Developers often have to search through to add new code and debug and it’s important to have names that are searchable by typing in the search box or command line

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

```javascript
// Bad!
const yyyymmdstr = moment().format("YYYY/MM/DD");

// Good!
const currentDate = moment().format("YYYY/MM/DD");
```

**Destructuring:**

Make use of destructuring (extraction of values) in arrays and objects to use meaningful and pronounceable names. Instead of using the indices or keys, we can give the item a name!

```javascript
// Bad!
const address = "One Infinite Loop, Cupertino 95014";
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/;
saveCityZipCode(
  address.match(cityZipCodeRegex)[1],
  address.match(cityZipCodeRegex)[2]
);
```

```javascript
// Good!
const address = "One Infinite Loop, Cupertino 95014";
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/;
const [_, city, zipCode] = address.match(cityZipCodeRegex) || [];
saveCityZipCode(city, zipCode);
```

**Copying:**

```javascript
// Bad!
let a2 = [...a1];

// Good!
let destinationArray = [...sourceArray]; 
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

```javascript
// Bad!
let fruitArray = [];

// Good!
let fruits = []
```

**Other noise words in the name:**

1. **Using `var` or `variable`**

We shouldn’t add noise words like variable in a variable. It makes the name longer without revealing additional information.

```javascript
// Bad! Additional noise
let countVar

// Bad! Additional noise
let countVariable

// Good!
let count
```

2. **Don't use member prefixes**

- We don’t need prefixes are class and function member names since they’re already inside the class
- Classes and functions should be small enough that there shouldn’t be too many members.

```javascript
// Bad!
let m_description

// Good!
let description // <-- Good enough
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

We can also term this tip as _"Use searchable names"_

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

## 7. Use unambiguous names

They shouldn’t have double meaning where people have to guess what the name actually means. Guessing is bad since people may lead to the wrong conclusion and make mistakes when changing the code

**Bottom line:**

_Don't make people guess!_ They can guess wrong and things can go awry!

```javascript
// Bad!
let rename = () => {
  // ?? Rename what? A string, a file, or a class?
  // ...
};

// Good!
let renameFile = () => {
  // more appropriate since we know for sure that the function is for renaming a file.
  // ...
};
```

## 8. Purpose, Concept, and Contract

A good name might have these characteristics:

- Purpose: What something is for and how it behaves 
- Concept: Its core idea and how to think about it
- Contract: Expectations about how it works

Following these enhances _MAINTAINABILITY_ and _FAMILIARITY_ since some of them are conventions

1. Purpose is highly contextual

```javascript
// Bad! Too much or unnecesary context
class TenancyAgreement {
  saveSignedDocument(
    tenancyAgreementSignedDocumentID,
    tenancyAgreementSignedDocumentTimestamp
  ) {}
}
```

```javascript
// Good! Just enough context
class TenancyAgreement { // `TenancyAgreement` is the "namespace" for the names that exist inside it
  saveSignedDocument(
    documentID,
    documentTimestamp
  ) {}
}
```

Advice from "Clean Code in Javascript": "When we have a surrounding context that communicates its purpose well, we shouldn't need to granularize the naming of every variable within that context"

2. For a function, the purpose is its **behavior**

It means the way in which a function acts or conducts itself on things it manipulates. That is its purpose. Put simply, it means the "Way in which it works". Ex: `isTruthy()` works by checking if something passed to it is truthy, `saveSignedDocument` works by saving a signed document.

3. For functions, `one verb + one adjective + one noun` at the most must suffice usually. (Ex: `refreshSignedDocument()` where refesh is a verb, signed is an adjective, document is the noun)

4. If a name requires a comment to explain its purpose, then that is usually an indicator that it has not done its job as a name.

5. Common contracts:
  - Variables and functions starting with `is` contain or return booleans. (Ex: `isMetal`, `isDependentOfModule(dependency)`)
  - Constant values are assigned to variables in all-caps. (Ex: `const DEFAULT_TIME_LIMIT = 3600`)
  - Plural variable names include more than one value - such as arrays (Ex: `const names = ['Rahul', 'Pushkar']`). Conversely, singular variable names are expected to contain a single value
  - Functions with names beginning with `get`, `find`, or `select` are usually expected to return something to you (Ex: `getIds()`, `selectLongestYear(years)`, `findNode(nodes)`)
  - Properties starting with underscore (`_`) are meant to private (pseudo) and not supposed to be accessed by outside code. (Ex: `_processConfig()`)
  - camelCase for naming functions. (Ex: `getStuffDone()`)
  - PascalCase for naming classes and constructor functions. (Ex: `SuperArray`, `SomeClassName`)

## 9. Naming anti-patterns

1. Needlessly short names

Such names make it less clear about what the abstraction is! Use clear names.

```javascript
// Bad!
function incId(id, f) {
  for (let x = 0; x < ids.length; ++x) {
    if (ids[x].id === id && f(ids[x])) {
      ids[x].n++;
    }
  }
}
```

```javascript
// Good!
function incrementJobInstancesByIdIfFilter(id, filter) {
  for (let i = 0; i < jobs.length; i++) { // Note: `i` is fine (Over time, loop counters have come to be assigned single character variables)
    let job = jobs[i];
    if (job.id === id && filter(job)) {
      job.nInstances++;
    }
  }
} 
```

2. Needlessly exotic (fancy) names

Such names draw unnecessary attention and makes you look cool but it is actually hard for others to understand (obscures the meaning)

- Keep it simple. Use `delete` over `kill` or `obliterate`
- Don't create fancy words like `deletify` or `dedupify` 
- Avoid puns or clever insinuations. Ex: Using chemical element names for DOM elements

3. Needlessly long names

Long names are a clue to a broken or confused abstraction

```javascript
// Bad!
documentManager.refreshAndSaveSignedAndNonPendingDocuments();
```

With names this long, a good guideline is to refactor the underlying abstraction so that we only need a name with, at most, one verb, one adjective, and one noun. 

- Verb: action, state, or occurrence (Ex: `hear`, `become`, `happen`, `do`, `get`, `set`, `find`, etc)
- Adjective: An attribute (description or modification) of a noun (Ex: `sweet`, `red`, `technical`, `pending`, `skilled`, etc)
- Noun: Denotes people, place, or things (if general, it is a "common noun" and if specifc, it is a "proper noun") (Ex: `Toyota`, `Person`, `Employee`, `Document`, `Card`, `Bundle`, etc)

```javascript
// Good!
documentManager.refreshSignedDocuments();
documentManager.refreshNonPendingDocuments();
documentManager.saveSignedDocuments();
documentManager.saveNonPendingDocuments();

// We have forced ourselves to better abstract our code just by thinking about the name!
```

## 10. Use hierarchy as context for naming things

Our folder, module, class, and function structures all contribute to NAMESPACING within which we can have appropriate names (omitting the unnecessary context). A good hierarchy should give rise to appropriate naming within it that makes use of the hierarchy

```javascript
// Bad!
app/
|-- deepClone.js
|-- deepEquality.js
|-- getParamsFromURL.js
|-- getURL.js
|-- openModal.js
|-- openModalWithTemplate.js
|-- setupAppWithCustomConfig.js
|-- setupAppWithDefaultConfig.js
|-- setURL.js
|-- ...
```

```javascript
// Good!
app/
|-- setup/
|   |-- defaultConfig.js
|   |-- setup.js
|-- modal/
|   |-- open.js
|   |-- openWithTemplate.js
|-- utils/
    |-- url/
    |   |-- getParams.js
    |   |-- get.js
    |   |-- set.js
    |-- obj/
        |-- deepEquality.js
        |-- deepClone.js
```

## 11. Use hungarian notation but only for specific cases

Hungarian notation prefixes or suffixes the tyepe of the value. Initally considered to be good for dynamically typed languages.

This is a controversial guideline. Many people are against using hungarian notation to specify the type of a value because it adds **noise** and increases **code rigidity** (we may instead use methods like duck typing to prevent wrong types of objects being passed to it).

- Don't use it for built in types
- It may be okay to use it for domain or platform specific types. (Ex: A DOM element prefixed with `el` makes it very clear what type of value this is)

Example:

```javascript
// Bad!
const arrNames = ['Matt', 'Ram', 'Sita']

// Good!
const elHeader = document.getElementById('header') // How about `$header`?
```

If you care too much about types and type checking in code, use a type checker tool like **typescript** or **flow**

## Conclusion

Software application that will be maintained over a considerable time or will be developed by several developers, it is when we will have the need to read and reread our source code. At this time, the name we assign to our variables will give us a touch of quality and clean code.