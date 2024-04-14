const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate(
  'b0aa0946f7498c197e1a55fae51782dd8ec2937d8b64bab246a2edc2516262da'
);
const myWalletAddress = myKey.getPublic('hex');

let cherryCoin = new Blockchain();

const tx1 = new Transaction(
  myWalletAddress,
  'to address public key gone here',
  10
);
tx1.signTransaction(myKey);
cherryCoin.addTransaction(tx1);

console.log('\n strating the miner...');
cherryCoin.minePendingTransactions(myWalletAddress);

console.log(
  '\n Balance of miner-reward is',
  cherryCoin.getBalanceOfAddresss(myWalletAddress)
);

cherryCoin.chain[1].transactions[0].amount = 1;

console.log('Is Chain valid?', cherryCoin.isChainValid());
