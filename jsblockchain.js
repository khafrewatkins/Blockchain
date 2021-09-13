// require use of imported crypto-js library's sha256
const SHA256 = require('crypto-js/sha256');

class Transactions{  
    constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
};
}
// Block constructor
class Block {
    constructor (timestamp, transactions, previousHash = ''){
        // naming each using this since it has the same name as it does in the constructor
        // the index property of the block
        // this.index = index;
        // the timestamp from when it is created
        this.timestamp = timestamp;
        // the data prop of the block or ledger -- then changed to transactions from data.
        this.transactions = transactions;
        // the hash from the previous block in the chain
        this.previousHash = previousHash;
        // the function/method that hashes the current block in the chain
        this.hash = this.calculateHash();
        // this is used to set the difficulty of mining. So, when it is 1 it 
        // will require one zero infront of a hash to make it valid.  Two would require
        // two zeros and so on.  Meaning it will only keep and use the hash of 'x' 
        // number of zeros infront of the hash. Also, the nonce sets what that number will be that 
        // represents the difficulty in front of the hash.
        this.nonce = 0;
    }
    // this function is to calculate the empty hash in this case
    // using SHA256
    calculateHash(){
          
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactions)+this.nonce).toString();
    }

    mineNewBlock(difficulty){
        while (this.hash.substring(0,difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();

        }

        console.log('This block was mined with this hash ' + this.hash);
    }
}
// uses the Block class to build the Genesis Block which is built manually so far.
class BlockChain {
    constructor(){
        // the first variable in the genesis block
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 10;



    }

    createGenesisBlock(){
        return new Block('09/05/2021','This is the genesis block, no data yet',0);

    }
    // new block object 
    // hash of the previous block
    // calculate hash of the current block
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineNewBlock(this.difficulty);
        console.log('Block mined successfully!');

        this.chain.push(block);
        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance = balance-trans.amount;
                }
                if(trans.toAddress === address){
                    balance = balance+trans.amount;
                }
            }
        }
        return balance;
    }

    // 
    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineNewBlock(this.difficulty);
    //     this .chain.push(newBlock);
    // }

    checkBlockValid(){
        // not looping from the genesis block since its checking if the block is valid based on the 
        // previous hash.  running this loop and including the genesis block or 0 index would not work
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1]

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

            return true;
        }
    }

}

let bittyCoin =  new BlockChain();

transaction1 = new Transactions('Tom', 'Jerry', 100);
bittyCoin.createTransaction(transaction1);


transaction2 = new Transactions('Jerry', 'Tom', 30);
bittyCoin.createTransaction(transaction2);

console.log('Started mining by the miner....')
bittyCoin.minePendingTransactions('Donald');

console.log('The balance for Tom is:'+bittyCoin.getBalanceOfAddress('Tom'));
console.log('The balance for Jerry is:'+bittyCoin.getBalanceOfAddress('Jerry'));
console.log('The balance for miner Donald before mining his reward is:'+bittyCoin.getBalanceOfAddress('Donald'));

bittyCoin.minePendingTransactions('Donald');

console.log('The balance for miner Donald after he mined his reward is:'+bittyCoin.getBalanceOfAddress('Donald'));



bittyCoin.minePendingTransactions('Donald');

console.log('The balance for miner Donald after he mined his reward is:'+bittyCoin.getBalanceOfAddress('Donald'));

// create two new blocks
// let block1 = new Block(1, '09/07/2021', {myBalance : 100});
// let block2 = new Block(2, '09/07/2021', {myBalance : 50});
// // create new blockchain
// let myBlockChain =  new BlockChain();
// add the two new blocks to the chain
// myBlockChain.addBlock(block1);
// myBlockChain.addBlock(block2);

// console.log(JSON.stringify(myBlockChain,null,4));




// -------------------------------------------------------
// Check for validation which has not adjustments to the blockchain's ledger and returns true
// console.log('Validation check for myBlockChain: ' + myBlockChain.checkBlockValid());
// following the order of operation in javascript, attempt at changing and already established block's ledger
// which in this case is myBalance and returns false
// myBlockChain.chain[1].transactions = {myBalance : 8000};
// console.log('Validation check for the altered ledger myBlockChain: ' + myBlockChain.checkBlockValid());
