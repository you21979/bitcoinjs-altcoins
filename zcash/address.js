const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib")
const bs58check = require("bs58check")
  
const mnemonic = bip39.generateMnemonic(256)
const password = ''

const seed = bip39.mnemonicToSeedSync(mnemonic, password)
const m = bip32.fromSeed(seed)

const BIP44 = "m/44'/133'/0'"
const BIP32_XPRV = m.derivePath(BIP44).toBase58()
const BIP32_XPUB = m.derivePath(BIP44).neutered().toBase58()

const BIP44_FULL = BIP44 + "/0/0"
const node = m.derivePath(BIP44_FULL)


const networks_zcash = {
    messagePrefix: '\x19Zcash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    zaddr: 0x169a,
    zkey: 0xab36,
    dustThreshold: 1000,
};

const getAddress = (node) => {
  const w = bitcoin.payments.p2pkh({ pubkey: node.publicKey })
  const payload = Buffer.allocUnsafe(22);
  payload.writeUInt16BE(networks_zcash.pubKeyHash, 0);
  w.hash.copy(payload, 2);
  return bs58check.encode(payload);
}

const address = getAddress(node)

const info = {
  BIP39_MNEMONIC : mnemonic,
  BIP39_PASSPHRASE: password,
  BIP32_SEED: seed.toString('hex'),
  BIP44: BIP44,
  BIP32_XPRV: BIP32_XPRV,
  BIP32_XPUB: BIP32_XPUB,
  BIP44_ACCOUNT: BIP44_FULL,
  ADDRESS: address,
}

console.log(JSON.stringify(info, null, 2))
