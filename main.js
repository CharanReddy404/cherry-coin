const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGeniousBlock()];
  }

  createGeniousBlock() {
    return new Block(0, '02/08/1999', 'Genious block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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

cherryCoin.addBlock(new Block(1, '13/04/2022', { amount: 20 }));
cherryCoin.addBlock(new Block(2, '13/04/2023', { amount: 40 }));
cherryCoin.addBlock(new Block(3, '13/04/2024', { amount: 80 }));

console.log('is blockchain valid: ', cherryCoin.isChildValid());

cherryCoin.chain[2].data = { data: 400 };
cherryCoin.chain[2].hash = cherryCoin.chain[2].calculateHash();

console.log('is blockchain valid: ', cherryCoin.isChildValid());

// console.log(JSON.stringify(cherryCoin, null, 4));
