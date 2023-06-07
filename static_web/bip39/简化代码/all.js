require('./../src/js/sjcl-bip39');
require('./../src/js/wordlist_english')
const Mnemonic = require('./../src/js/jsbip39');
require('./../src/js/big39-libs.nor');

console.log(Mnemonic);

var mnemonics = { "english": new Mnemonic("english") };
var mnemonic = mnemonics["english"];
let word = "blind stable enable interest bacon play dice arrange rib slot dinosaur present"
    .split(' ');
let seed = mnemonic.toSeed(word.join(' '),"");
bip32RootKey = libs.bitcoin.HDNode.fromSeedHex()
let derivationPath = "m/44'/0'/0'/0";



