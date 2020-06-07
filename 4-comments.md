# Comments

There are no absolute rules. 

**Reasons not to add comments:**

1. There are a number of cases in which the comments do NOT contribute to software development because they have been replaced by other tools. 
2. In other cases, comments may cause noise to the source code that we are developing, or that we will be reading in the future

**Reasons to add comments:**

1. On the other hand, there may be cases in which comments are good practices, such as the documentation of a public API in which to learn the behavior of a library, but not how it is developed.

## 1. Only comment things that have business logic complexity

Comments have to exist only to help programmers in explaining business logic that is complicated for programmers to understand. 

**Dont's**

1. No comments to describe algorithms
2. No comments to describe **what** is being done in terms of programming

**Do's**

1. Explain the business logic only

**Reason**

Good code is most of the time self-documented and therefore, the source code is understood with the fact of being read. _Comments are an extra, not a requirement_

```javascript
// Bad!
function convert(data){
 // The result
 let result = 0;

 // length of string
 const length = data.length;

 // Loop through every character in data
 for (let i = 0; i < lenght; i++){
   // Get character code.
   const char = data.charCodeAt(i);
   // Make the hash
   result = (result << 5) - result + char;
   // Conver to 32-bit integer (<== Only this comment is relevant as it describes
   // what is being done at business logic not at programming level - i.e it does not 
   // say 'uses the & operator on result'. Instead, it focuses on business concern of 
   // doing that operation)
   result &= result;
  }
}
```

```javascript
// Good!
function convert(data) {
  let result = 0;
  const length = data.length;

  for (let i = 0; i < length; i++){
    const char = data.charCodeAt(i);
    result = (result << 5) - result + char;
    result &= result; // Convert to 32-bit integer
  }
}
```

## 2. Don't have journal comments

It is a tendency to know what had happened to the file over time. We don't need it now in the age of version control. Use `git` instead!

```javascript
// Bad!
/**
 * 2018-12-20: Removed monads, didn't understand them (CC)
 * 2018-10-01: Improved using special mondas (JS)
 * 2018-02-03: Removed type-checking (LI)
 * 2017-03-14: Added add with type-checking (CC)
 */
function add(a, b) {
  return a + b;
}
```

```javascript
// Bad!
/* Added by Bob */
function foo() {}
```

```javascript
// Good!
function add(a, b) {
  return a + b;
}
```

 ## 3. Avoid positional markers

You should avoid positional markers because usually just add noise.

**Reason:**

Let the functions and variable names along with the proper identation and formatting give the visual structure to your code.

```javascript
// Bad!
///////////////////////////////
//  Controller Model Instantiation
///////////////////////////////
controller.model = {
  name: 'Felipe',
  age: 34
};

///////////////////////////////
//  Action Setup
///////////////////////////////
const actions = function() {
  // ...
};
```

```javascript
// Good!
controller.model = {
  name: 'Felipe',
  age: 34
};

const actions = function() {
  // ...
};
```

## 4. Don't leave commented out code in your codebase

Version control exists for a reason. Leave old code in your history.

```javascript
// Bad!
doStuff();
// doOtherStuff();
// doSomeMoreStuff();
// doSoMuchStuff();

// Good!
doStuff();
```

## 5. Too much information

Nobody wants to read an essay in the comments, so we shouldn’t write one. Better just to keep it short if we need them at all

## 6. Avoid mumbling

Adding comments just because we feel like it or the process requires it isn’t a good reason to put in comments. At least the comments have to be useful if we’re to write them

```javascript
// Bad!
try {
  loadProperties();
} catch (e) {
  // No properties means everything is loaded
}
```

What is `properties`? When is everything loaded? Not very useful info!

```javascript
// Bad!
try {
  loadProperties();
} catch (e) {}
```

## 7. Don’t Use Comments when Identifiers Can be Named Better

We can easily write code that explains itself

```javascript
// Bad!
// check if employee is eligible for child care benefits
if (employee.salary < 50000 && employee.hasChild) {
  //...
}

// Good!
const isEligibleForChildCareBenefits = (employee) => {
  return employee.salary < 50000 && employee.hasChild;
}
if (isEligibleForChildCareBenefits(employee)) {
  //...
}
```

## 8. Avoid misleading comments

Misleading comments lead developers that are working on a piece of code to have the wrong understanding of the code and make bad decisions and create bugs.

This obviously isn’t good. It leads to more time debugging to find out why something won't work as they described in the comments.