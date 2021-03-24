// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  // hardhat node
  1337: {
    simpleStorage: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    simpleStorageCoin: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    simpleStorageBadge: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
  },
  // ropsten
  3: {
    simpleStorage: "0x32D5AFB271C22ed6Db72D5D336F48E96eBc0c66C",
    simpleStorageCoin: "0x866587154EE80b291E7f418F5944d4C5BCC967aa",
    simpleStorageBadge: "0xD8b5871d1176D75A2a164e33B397222b996a6c35",
  },
};

export default addresses;
