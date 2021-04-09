// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  // hardhat node
  1337: {
    simpleStorage: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    simpleStorageCoin: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    simpleStorageBadge: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    marketplace: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
  },
  // ropsten
  3: {
    simpleStorage: "0xaC691D54cD5C60605F810DD104f238e587afBDd7",
    simpleStorageCoin: "0x05C3a160315c568a4BEEA9C7243D3fBee220D761",
    simpleStorageBadge: "0xce5B0f04e3C2E0990cD211ea1d63e0CD9BCF8D70",
    marketplace: "0x040b68C85c854B5adD2aB8Aad107574AD6823906",
  },
};

export default addresses;
