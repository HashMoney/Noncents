# Block Chain Dev
<!-- One Paragraph of project description goes here -->

#### WIKI: https://github.com/HashMoney/block-chain-dev/wiki

**Travis CI**: https://travis-ci.org/HashMoney/block-chain-dev
**Heroku App**:
- Login: https:/dashboard.heroku.com/apps/hash-money
- Deployment: https://hash-money.herokuapp.com/


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Install the stable version of Node JS, which is available at the following link
`https://nodejs.org/en/`

This environment should allow you to run all code present in this repository.

### Installing
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


## Running the tests
To run the tests, you type into the command line `npm run test`

This will run all tests and output a coverage level (provided by Jest) describing percentage of lines covered across documents.

### And coding style tests
Explain what these tests test and why

Give an example
## Deployment
Add additional notes about how to deploy this on a live system

## Built With
Node - JS Runtime Build
Mongo DB - Chain Persistence
Heroku - Hosted Deployment 
Travis CI -  Integration Testing 

## NPM Packages Used 
Express - CRUD routes to server
Jest, Superagent - Unit Testing
Mongoose - Data manipulation within Mongo
JS Hashes - SHA256 Hashing 
Eslint - Linting
HttpErrors, Winston - Activity/Error Logging

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
