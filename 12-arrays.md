# Arrays

## 1. Use Array.includes for multiple criteria in conditionals

The code looks tidier and is extensible

```javascript
// Bad!
function test(fruit) {
  if (fruit == 'apple' || fruit == 'strawberry') {
    // Hard to extend this if more fruits need to be tested
    console.log('red');
  }
}

// Good!
function test(fruit) {
  // extract conditions to array
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];

  if (redFruits.includes(fruit)) {
    console.log('red');
  }
}
```

## 2. Use Array.every & Array.some for All / Partial Criteria

It helps reduce the lines of code.

```javascript
// Bad!
const fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'grape', color: 'purple' }
  ];

function test() {
  let isAllRed = true;

  // condition: all fruits must be red
  for (let f of fruits) {
    if (!isAllRed) break;
    isAllRed = (f.color == 'red');
  }

  console.log(isAllRed); // false
}
```

```javascript
// Good!
onst fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'grape', color: 'purple' }
  ];

function test() {
  // condition: short way, all fruits must be red
  const isAllRed = fruits.every(f => f.color == 'red');

  console.log(isAllRed); // false
}
// For any fruit to be red: use `fruits.some()`
```

## 3. Use sets to remove duplicates from an array

```javascript
let cities = ['London', 'Delhi', 'Tel Aviv', 'Delhi', 'Sydney', 'Sydney']
cities = [ ...new Set(cities)]
```

## 4. Use sets instead of arrays when you need unique values

Set and WeakSet are native abstractions that allow us to store sequences of unique objects.

Set and WeakSets: WeakSets are for weakly holding values in a way that allows that value to be garbage-collected in another part of the program

```javascript
const foundNumbersArray = [1, 2, 3, 4, 3, 2, 1];
const foundNumbersSet = new Set([1, 2, 3, 4, 3, 2, 1]);

foundNumbersArray; // => [1, 2, 3, 4, 3, 2, 1]
foundNumbersSet;   // => Set{ 1, 2, 3, 4 }

new Set('wooooow'); // => Set{ 'w', 'o' }
```