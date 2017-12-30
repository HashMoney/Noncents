#Block Chain Dev

## Models

### Block
1. index
1. hash
1. prev hash
1. timestamp
1. ledger
#### Hasher
hashes the block
#### Factory
generates new block- takes in previous block, builds last and current hash, passes them in to new Block()
#### isValidBlock
checks the index of the most recent block, the hash of the previous block against the stored hash of the previous block, and rehashes the newest block and ensures it matches the stored hash. Also checks that newest block contains all required properties.

### Chain
1. Root
#### Pusher
pushes the entire chain to temp storage in everyones server for length comparisons
#### isValidChain
checks the geneseis block, calls the isValidBlock function on all the other blocks

### WebSockets
Stores an array of all met servers

### Stable chain
the most current longest chain that has been approved by the collection of servers. All new blocks are built onto this.

### Competing Chains
chains that are competing for longest chain get stored here and compared with each other. Once a majority of servers accept one chain as both the first and the longest chain, that chain becomes the Stable Chains

## Routes
1. made to socket list
### GET CHAIN
whenever a server connects- it requests the longest chain
### POST CHAIN
when a server generates a new block- it sends it to the other servers
### GET SOCKETS
copies another peers sockets
### POST SOCKETS
adds sockets to peers
### DELETE SOCKETS
adds sockets to peers




## Routes
