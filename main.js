const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ', this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGeniousBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGeniousBlock() {
    return new Block(0, '02/08/1999', 'Genious block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transactions) {
    this.pendingTransactions.push(transactions);
  }

  getBalanceOfAddresss(address) {
    let balance = 0;
    for (let block of this.chain) {
      for (let trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChildValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previoustBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash != previoustBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let cherryCoin = new Blockchain();

cherryCoin.createTransaction(new Transaction('address1', 'address2', 100));
cherryCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n strating the miner...');
cherryCoin.minePendingTransactions('miner-reward-address');

console.log(
  '\n Balance of miner-reward is',
  cherryCoin.getBalanceOfAddresss('miner-reward-address')
);

console.log('\n strating the miner...');
cherryCoin.minePendingTransactions('miner-reward-address');

console.log(
  '\n Balance of miner-reward is',
  cherryCoin.getBalanceOfAddresss('miner-reward-address')
);
