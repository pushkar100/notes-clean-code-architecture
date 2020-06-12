# Abstraction principle

LoD, SOLID, tenets of clean code - all these deal with **abstractions**. But, how much abstraction is good?

When you **under-abstract** you are breaking the principle of **DRY** (Don't Repeat Yourself). 

DRY: A warning that tells us to avoid writing code that duplicates other code we have written. If you find yourself having to repeat yourself, then this indicates that you've failed to abstract something, or have under-abstracted something.

When you **over-abstract** you are breaking the principle of **YAGNI** (You Ain't Gonna Need It) or **KISS** (Keep It Simple, Silly!). 

YAGNI/KISS: This warning tells us to be wary of over-abstracting code that does not need to be abstracted. It's the polar opposite of DRY, and serves to remind us that we should not attempt abstraction unless it's warranted (if we start to repeat ourselves, perhaps). 

Between these two warnings, somewhere in the middle, lies the perfect abstraction.

## Over-abstraction

The risk with over-abstraction is that we either remove too much complexity in favor of simplicity or we add new unnecessary complexity that confuses the user of our abstraction.

An abstraction which encodes new complexities and prescribes its own features and naming conventions, is at risk of not only failing to reduce complexity, but also of increasing it! An abstraction has no business in increasing complexity; that is antithetical to the entire point of abstraction.

## Under-abstraction

Under-abstraction is when too little complexity has been removed or replaced. This results in a situation where the user of the abstraction then needs to concern themselves with the underlying complexity.

Various abstractions can be said to be **leaky abstractions** because they leak parts of their complexity upwards, through their interfaces.