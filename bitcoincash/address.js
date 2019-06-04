const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib")
const cashaddr = require("cashaddrjs")
  
const mnemonic = bip39.generateMnemonic(256)
const password = ''

const seed = bip39.mnemonicToSeedSync(mnemonic, password)
const m = bip32.fromSeed(seed)

const BIP44 = "m/44'/145'/0'"
const BIP32_XPRV = m.derivePath(BIP44).toBase58()
const BIP32_XPUB = m.derivePath(BIP44).neutered().toBase58()

const BIP44_FULL = BIP44 + "/0/0"
const node = m.derivePath(BIP44_FULL)

const getAddress = (node) => {
  const w = bitcoin.payments.p2pkh({ pubkey: node.publicKey })
  return cashaddr.encode('bitcoincash', 'P2PKH', w.hash)
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
