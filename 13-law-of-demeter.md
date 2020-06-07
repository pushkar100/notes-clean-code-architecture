# Law of Demeter

The Law of Demeter states that we should hide the implementation details of our code as much as we can. This ensures that we have loose coupling between our code

**Why do we Need Loose Coupling?**

Loose coupling means that we don’t have to worry about changing a lot of code when one piece of code changes.

Each unit only has limited knowledge about other units so that only a few parts of the other units are referenced.

They only talk to their immediate friends, so that they don’t talk to other parts that aren’t related.

So this means that if we have 2 classes `A` and `B`, then `A` only references the methods of `B` than has to be referenced. Other members are kept private along with other implementation details.

**How do we apply the Law of Demeter?**

We can apply the Law of Demeter to our JavaScript code by writing it in a way that _references a few classes and members of them as possible_

// TODO