const sha256 = require("sha256");

class Blockchain {
	constructor (){
	this.chain = [];
	this.pendingTransaction = [];
	// give the genesis block a nonce, previous hash and hash of 
	//zeros to begin with
	this.createNewBlock(100, '0', '0');
	}
	}

	// add other methods for the blockchain here
// lab 1 - 2
Blockchain.prototype.createNewBlock = function (
	nonce,
	previousBlockHash,
	hash
) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash,
	};
	// this.newTransaction = [];
	this.pendingTransactions = [];
	this.chain.push(newBlock);
	return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
	return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (
	amount,
	sender,
	recipient
) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
	};

	this.pendingTransactions.push(newTransaction);
	// return this.getLastBlock()["index"] + 1;
	return newTransaction;
};

// lab 3
Blockchain.prototype.addTransactionToPendingTransactions = function (
	transactionObj
) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()["index"] + 1;
};

// hashing
Blockchain.prototype.hashBlock = function (
	previousBlockHash,
	currentBlockData,
	nonce
) {
	const dataAsString =
		previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

module.exports = Blockchain;

//lab 4


Blockchain.prototype.proofOfWork = function(
	previousBlockHash, currentBlockData) {
		let nonce = 0;
		let hash = this.hashBlock(previousBlockHash,
		currentBlockData, nonce);
		while (hash.substring(0, 4) !== '0000') {
			nonce++;
			hash = this.hashBlock(previousBlockHash, currentBlockData,
			nonce);
			console.log(hash);
		}
		return nonce;
	}