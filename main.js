const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
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
    this.difficulty = 6;
  }

  createGeniousBlock() {
    return new Block(0, '02/08/1999', 'Genious block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    console.time('mine');
    newBlock.mineBlock(this.difficulty);
    console.timeEnd('mine');
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

console.log('Mining block 1...');
cherryCoin.addBlock(new Block(1, '13/04/2022', { amount: 20 }));
console.log('Mining block 2...');
cherryCoin.addBlock(new Block(2, '13/04/2023', { amount: 40 }));
console.log('Mining block 3...');
cherryCoin.addBlock(new Block(3, '13/04/2024', { amount: 80 }));

// console.log('is blockchain valid: ', cherryCoin.isChildValid());

// cherryCoin.chain[2].data = { data: 400 };
// cherryCoin.chain[2].hash = cherryCoin.chain[2].calculateHash();

// console.log('is blockchain valid: ', cherryCoin.isChildValid());

// console.log(JSON.stringify(cherryCoin, null, 4));
