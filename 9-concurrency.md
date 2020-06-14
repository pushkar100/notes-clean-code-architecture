# Concurrency

## 1. Use Promises, not callbacks

Callbacks aren't clean, and they cause excessive amounts of nesting. With ES2015/ES6, Promises are a built-in global type. Use them!

```javascript
// Bad!
import { get } from "request";
import { writeFile } from "fs";

get(
  "https://en.wikipedia.org/wiki/Robert_Cecil_Martin",
  (requestErr, response, body) => {
    if (requestErr) {
      console.error(requestErr);
    } else {
      writeFile("article.html", body, writeErr => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          console.log("File written");
        }
      });
    }
  }
);
```

```javascript
// Good!
import { get } from "request-promise";
import { writeFile } from "fs-extra";

get("https://en.wikipedia.org/wiki/Robert_Cecil_Martin")
  .then(body => {
    return writeFile("article.html", body);
  })
  .then(() => {
    console.log("File written");
  })
  .catch(err => {
    console.error(err);
  });
```

## 2. Async/Await are even cleaner than Promises

Promises are a very clean alternative to callbacks, but ES2017/ES8 brings async and await which offer an even cleaner solution. All you need is a function that is prefixed in an async keyword, and then you can write your logic imperatively without a then chain of functions. Use this if you can take advantage of ES2017/ES8 features today!

```javascript
// Okay!
import { get } from "request-promise";
import { writeFile } from "fs-extra";

get("https://en.wikipedia.org/wiki/Robert_Cecil_Martin")
  .then(body => {
    return writeFile("article.html", body);
  })
  .then(() => {
    console.log("File written");
  })
  .catch(err => {
    console.error(err);
  });
```

```javascript
// Good!
import { get } from "request-promise";
import { writeFile } from "fs-extra";

async function getCleanCodeArticle() {
  try {
    const body = await get(
      "https://en.wikipedia.org/wiki/Robert_Cecil_Martin"
    );
    await writeFile("article.html", body);
    console.log("File written");
  } catch (err) {
    console.error(err);
  }
}

getCleanCodeArticle()
```

## 3. Callbacks versus Promises versus Async/await

**Callbacks = Inversion of Control**

The function you pass a callback to is entirely in control of when your callback is invoked, how it is invoked, and what data is passed along with that invocation. This is why sometimes callbacks are spoken about as an inversion of control. We are relying on another function or abstraction to (at some point) call your callback in the expected manner.

**Callbacks = Horizontal pyramids**

Callback hell is the name given to the undesirable proliferation of multiple nested callbacks within a piece of code, usually done to carry out a series of asynchronous tasks that each rely on another previous asynchronous task.

```javascript
async(task, () => {
  async(task, () => {
    async(task, () => {
      async(task, () => {
        async(task, () => {
          async(task, () => {
            // Something
          })
        })
      })
    })
  })
})
```

**Solving the horizontal pyramid**

- Choose an event emitter system (OR)
- Choose a promise (OR)
- Choose async/await