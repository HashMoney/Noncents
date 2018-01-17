# Code Review
Overall: very cool project! Great job picking something challenging and making
it work!

#### Repo README Appearance
Good inclusion of terminal shots in your README. Your README does look a bit
sparse when the page first loads. Other groups put logos or badges near the top
of the README. I understand this project is very back-end focused, but
definitely consider getting something pretty at the beginning of your README in
the future simply because it makes the README more engaging!

#### Overall Code Style
Generally fantastic style! Good variable names, good use of methods and good
indentation.

Put comments on top of lines of code, not beside them. This is just to keep
lines short. Short lines make it easier for coworkers to look at their code
using a variety of editors, and makes it easier for you to look at your code in
online tools like GitHub without scrolling horizontally all the time.

```js
while (currentHash.slice(0, hashSlice) !== leadingZeros) { // This is where we increase the difficulty of the hash by increasing the leading Zero's, '000'.
  nonce++; // The Nonce essentially is the number of times the hash had to be re-hashed to match the leading Zero's requirement.
  currentHash = this.makeBlockHash(index, timeStamp, previousHash, ledger, nonce); // Make another hash until it meets the leading Zero requirement.
}
```

```js
// This is where we increase the difficulty of the hash by increasing the
// leading Zero's, '000'.
while (currentHash.slice(0, hashSlice) !== leadingZeros) {
  // The Nonce essentially is the number of times the hash had to be re-hashed
  // to match the leading Zero's requirement.
  nonce++;

  // Make another hash until it meets the leading Zero requirement.
  currentHash = this.makeBlockHash(index, timeStamp, previousHash, ledger, nonce);
}
```

There's a VERY Long line in `server.js`

```
if (blockToValidate.hasOwnProperty('nonce') && blockToValidate.hasOwnProperty('currentHash') && blockToValidate.hasOwnProperty('ledger') && blockToValidate.hasOwnProperty('timeStamp') && blockToValidate.hasOwnProperty('previousHash') && blockToValidate.hasOwnProperty('index') && Object.keys(blockToValidate).length === 6) {

}
```

Consider shortening the line and adding more structure to the code by breaking
each line to it's own line:

```
if (blockToValidate.hasOwnProperty('nonce') &&
    blockToValidate.hasOwnProperty('currentHash') &&
    blockToValidate.hasOwnProperty('ledger') &&
    blockToValidate.hasOwnProperty('timeStamp') &&
    blockToValidate.hasOwnProperty('previousHash') &&
    blockToValidate.hasOwnProperty('index') &&
    Object.keys(blockToValidate).length === 6) {

}
```


#### Server Confusion
It's unclear to me why `server.js` exists. Is it actually hooked up to
anything? I don't see any obvious routing attached to it.

Ah, after talking to Seth and Kerry I found out there's totally different code
in this project on different branches. This is because the team needed to
deploy two top-level repos to two different heroku instances (or had planned
to). I suggested writing server in client code in two different directories in
the same repo, but Kerry and Seth pointed out it's hard to deploy directories
to Heroku without having to deal with configuration. Fair enough!

#### File Structure
Consider creating a `screenshots` or `assets` folder to hold png files that are
shown in your README.


#### Models
Your model definitions are awfully sparse with just the single Array
definition, but you've definitely got a lot of methods attached to that one
model.

```
const chainSchema = mongoose.Schema({
  currentChainArray: [],
});
```


