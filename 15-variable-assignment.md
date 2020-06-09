# Variable assignment

## 1. Signal unchanging values with const

**Rule**

- Use `const` by default

**About const**

- Cannot be re-assigned
- Assigned value can still be mutated

**Assignment indicates two things**

1. The information
2. What we plan to do with that information

**Why is `const` preferred?**

To track if a value is going to change is a mental exercise (i.e harder). If we explicitly specify that "this value is not going to change", it is good for readability

Use `const` until the point where re-assignment is absolutely required!

```javascript
// Bad!
var taxRate = 0.1
var tax = 100 + 100 * taxRate

// 
// 100 lines of code
// Possibility of `tax` changing (might)
// 

console.log('tax = ', tax)
```

```javascript
// Good!
const taxRate = 0.1
const tax = 100 + 100 * taxRate

// 
// 100 lines of code
// Does not matter! `tax` will never change
// 

console.log('tax = ', tax)
```

**Caution**

Data assigned to `const` is still mutable. Choose ways to avoid mutation of that data.

## 2. Reduce scope conflicts with `let` and `const`

**Rule**

- Use `const` is value is not meant to change
- Use `let` if value is going to change over time

**Why?**

- These are block scoped variables (i.e they exist only inside the closest `{}` scope). Outside it they are not accessible.
- Additionally, you cannot re-declare `let` and `const` (will get a compile time error) but there are no such restrictions on `var`

This prevents mistakes!

**What type of mistakes?**

Accidental re-assignments or overwrites in inner scope that affects outer scope too!

```javascript
// Bad!
function getLowestPrice(item) {
  var isItemAvailable = item.count ? true : false
  var lowestPrice = item.price

  if (item.discount.available) {
    var isItemAvailable = true // No error in redeclaration
    if (isItemAvailable) {
      lowestPrice = item.discount.price
    }
  }

  if (isItemAvailable) {
    return 0
  }

  return lowestPrice
} // Problem when item.count is 0 (Inventory is 0) but it is on discount
```

```javascript
// Good!
function getLowestPrice(item) {
  const isItemAvailable = item.count ? true : false
  let lowestPrice = item.price

  if (item.discount.available) {
    const isDiscountItemAvailable = true
    if (isItemAvailable) {
      lowestPrice = item.discount.price
    }
  }

  if (isItemAvailable) {
    return 0
  }

  return lowestPrice
}
```

## 3. Isolate information inside blocks with `let` and `const`

**Rule**

Never use `var` in blocks `{}` - especially in _loops_!

**Why?**

`var` is "lexically scoped" (essentially function scoped). If a part of code defined in a loop runs later (ex: async part) but the rest of function modifies the variable in the mean time, you run into trouble

**What type of trouble?**

The ones usually arising from "closure"!

```javascript
// Bad!
function logEachValueAfterDelay(values, delay) {
  for(var i = 0; i < values.length; i++) {
    setTimeout(function() {
      console.log(values[i]) // Always prints the last value in list
    }, delay)
  }
}
```

```javascript
// Good!
function logEachValueAfterDelay(values, delay) {
  for(let i = 0; i < values.length; i++) {
    setTimeout(function() {
      console.log(values[i])
    }, delay)
  }
}
```

## 4. Convert variables to readable strings with Template Literals

We know now that we must use `let` and `const` over `var`. How about combining variables to build a new variable?

**Rule**

Use the the backtick `\`` operator to combine multiple variables & expressions into one

**Dont's**

Do not use the `+` operator. **Why?** Because it adds to clutter and is complex

```javascript
// Bad!
function buildUrl(options) {
  return 'https://' + options.hostname + '/' + options.path + '?' + 'q=' + options.qValue
}

// Good!
function buildUrl(options) {
  const hostname = options.hostname // Even better to use destructuring
  const path = options.path
  const queryString = `q=${options.qValue}`
  return `https://${hostname}/${path}?${queryString}`
}
```

**Thumbrule**

Combining two strings OR variable and string OR expressions and string? Use template literals.

**Caution**

Do not add complex expression since it leads to the same problem of clutter

## Should we never use `var` ?

Probably not! No reason to use it. It already has existing drawbacks:

- No error is thrown if you declare the same variable twice using `var`
- Variables declared with `var` are not block scoped leading to the mistakes seen earlier
- Most experts agree - like Douglas Crockford (but maybe not Kyle Simpson!)

```javascript
// Bad!
// Nothing wrong with correctness of code
function getFavoriteOrOnlyCandy(candies = []) {
  var favoriteCandy = candies[0] 

  candies.forEach(candy => {
    if (candy.favourite) {
      favoriteCandy = candy
    }
  })

  return favoriteCandy
}
```

```javascript
// Good!
function getFavoriteOrOnlyCandy(candies = []) {
  // If let can do the job and throws error on redeclaration, why use var?
  let favoriteCandy = candies[0] 

  candies.forEach(candy => {
    if (candy.favourite) {
      favoriteCandy = candy
    }
  })

  return favoriteCandy
}
```

**The argument to use `var`**

> “There are going to be places in real world code where some variables are going to be properly scoped to the entire function, and for those variables, var is a better signal"

Essentially, Simpson is arguing that while changing var with let in the above example will still work the same, because two blocks explicitly take advantage of let’s block scoping (remember only let/const are block scoped not var), var is a helpful signal to indicate a function scope.

```javascript
function foo() {
  var a = 10 // Makes sense

  if (a > 2) {
    let b = a * 3
    console.log(b)
  }

  if (a > 5) {
    let c = a / 2
    console.log(c)
  }

  console.log(a)
}
```