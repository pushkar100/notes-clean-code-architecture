# Modules

Includes ES6 modules with `export/import` or CommonJS modules with `module.export/require`

## 1. Avoid too much information

Well-defined modules should be small and allow us to do a lot with little code. They don’t offer many functions to depend upon, so coupling is loose

A bad module has lots of functions that we have to call to get something done, so coupling is high (Unless they are utility functions of the same type)

_Utility functions should be hidden from other modules_

## 2. Remove dead code

Dead code should definitely be removed from our codebase. Our tests should check if functionality works without the dead code

Unused entities should be gone! This applies to functions, classes, constants, etc - everything!

```javascript
// Bad!
function oldRequestMethod() { 
  // Not used anymore
}
function newRequestMethod() { 
  // Used currently
}

// Good!
function newRequestMethod() { 
  // Used currently (We have removed the unused oldRequestMethod)
  // Use version control if you need it back)
}
```




