# Block Chain Dev
<!-- One Paragraph of project description goes here -->

#### WIKI: https://github.com/HashMoney/block-chain-dev/wiki

**Travis CI**: https://travis-ci.org/HashMoney/block-chain-dev
**Heroku App**:
- Login: https:/dashboard.heroku.com/apps/hash-money
- Deployment: https://hash-money.herokuapp.com/


## Problem Domain

This project is our initial attempt to understand and replicate the blockchain technology and potential applications.

Due to the blockchain's immutability, it allows both the sender and receiver to trust that the information sent follows a dictated structure and has a determined result.

We included the ability for distributed nodes to add to the blockchain with a simple terminal command.

## Prerequisites
Install the stable version of Node JS, which is available at the following link
`https://nodejs.org/en/`

This environment should allow you to run all code present in this repository.

## Installing
Create a new directory where you would like to store our project.

ex: 
```
mkdir hash-money
```
Clone the repository to this directory

```
git clone https://github.com/HashMoney/block-chain-dev.git

```
Install NPM dependencies
```
npm install 
```
If you would like to begin mining immediately, use the following command

```
node index.js
```
![Mining Starts](https://github.com/HashMoney/block-chain-dev/blob/nodeStaging/Screen%20Shot%202018-01-05%20at%208.58.32%20AM.png?raw=true)

```↑ Before```

```After ↓```

![Mining Example](https://github.com/HashMoney/block-chain-dev/blob/nodeStaging/Screen%20Shot%202018-01-05%20at%208.58.03%20AM.png?raw=true)

## Running the tests
To run the tests, you type into the command line `npm run test`
This will run all tests and output a coverage level (provided by Jest) describing percentage of lines covered across documents.
![Test Results](https://github.com/HashMoney/block-chain-dev/blob/nodeStaging/Screen%20Shot%202018-01-05%20at%208.43.45%20AM.png?raw=true)



## Server Endpoints

* `POST /block`
  - Node sends request to Heroku server to post new block to stable chain.
  - Heroku server checks to see if it is the next valid block in the chain.
  - If block is valid, Heroku server returns a 204 success status code to the node.
  - If block is valid, Heroku appends new block to the stable chain.
  - Returns a 400 failure status code to the node if either the index, previous hash, current hash are invalid or if this information is missing.
 
* `GET /chain`
  - Node sends a request to the Heroku server for the current stable chain.
  - Heroku server retrieves stable chain from database and sends stable chain back to node.
  - Heroku server returns a 200 success status code to the node.
  - Returns a 404 failure status code if an incorrect route is specified.

* `/`
  - Catch all route for any unspecified routes.
  - Returns a 404 Not Found


## Built With
- Node - JS Runtime Build  
- Mongo DB - Chain Persistence  
- Heroku - Hosted Deployment   
- Travis CI -  Integration Testing 

## NPM Packages Used 
- Express - CRUD routes to server  
- Jest, Superagent - Unit Testing  
- Mongoose - Data manipulation within Mongo
- JS Hashes - SHA256 Hashing   
- Eslint - Linting  
- HttpErrors, Winston - Activity/Error Logging

## Authors
- Kerry Nordstrom
- Seth Donohue
- Nicholas Carignan
- Jacob Evans
See also the list of contributors who participated in this project.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments
- We referenced a compact 200-line blockchain called Naivechain, written in JS, in order to define best practices for our code https://github.com/lhartikk/naivechain/blob/master/main.js
