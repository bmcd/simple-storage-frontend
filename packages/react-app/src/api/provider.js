import { Contract } from '@ethersproject/contracts'
import { abis, addresses } from '@project/contracts'

let provider = undefined

export function setProvider(newProvider) {
  provider = newProvider
}

export function getProviderInfo() {
  return {
    isMetaMask: provider.provider.isMetaMask,
    selectedAddress: provider.provider.selectedAddress,
  }
}

export async function getNetwork() {
  return provider.getNetwork()
}

export async function getAccounts() {
  return provider.listAccounts()
}

export function getWalletType() {
  if(provider.provider.isMetaMask) {
    return 'MetaMask'
  }
  if(provider.provider.isWalletConnect) {
    return 'WalletConnect'
  }
}

function getSigner() {
  return provider.getSigner()
}

async function getContract() {
  const { chainId } = await getNetwork()
  return new Contract(addresses[chainId].simpleStorage, abis.simpleStorageV4, provider).deployed()
}

async function getTokenContract() {
  const { chainId } = await getNetwork()
  return new Contract(addresses[chainId].simpleStorageCoin, abis.simpleStorageCoin, provider).deployed()
}

async function getBadgeContract() {
  const { chainId } = await getNetwork()
  return new Contract(addresses[chainId].simpleStorageBadge, abis.simpleStorageBadge, provider).deployed()
}

async function getMarketplaceContract() {
  const { chainId } = await getNetwork()
  return new Contract(addresses[chainId].marketplace, abis.marketplace, provider).deployed()
}

export async function getContractValue() {
  const simpleStorage = await getContract()
  return simpleStorage.get()
}

export async function callSetContractValue(inputValue) {
  const simpleStorage = await getContract()
  return simpleStorage.connect(getSigner()).set(inputValue)
}

export async function getAddressValue(address) {
  const simpleStorage = await getContract()
  return simpleStorage.getForUser(address)
}

export async function getPrice() {
  const simpleStorage = await getContract()
  const price = await simpleStorage.getPrice()
  return price.toNumber()
}

export async function callSetAddressValue(inputValue) {
  const simpleStorage = await getContract()
  return simpleStorage.connect(getSigner()).setForSender(inputValue)
}

export async function getTokenBalance(address) {
  const simpleStorageCoin = await getTokenContract()
  const balance = await simpleStorageCoin.balanceOf(address)
  return balance.toString()
}

export async function getAuthorizedBalance(address, contract) {
  const targetContract = contract === 'storage' ? await getContract() : await getMarketplaceContract()
  const simpleStorageCoin = await getTokenContract()
  const allowance = await simpleStorageCoin.allowance(address, targetContract.address)
  return allowance.toString()
}

export async function callApprove(inputValue, contract) {
  const targetContract = contract === 'storage' ? await getContract() : await getMarketplaceContract()
  const simpleStorageCoin = await getTokenContract()
  return simpleStorageCoin.connect(getSigner()).approve(targetContract.address, inputValue)
}

export async function getBadges(address) {
  const badge = await getBadgeContract()
  const count = (await badge.balanceOf(address)).toNumber()
  const badges = []
  for (let i = 0; i < count; i++) {
    const badgeId = await badge.tokenOfOwnerByIndex(address, i)
    const badgeUri = await badge.tokenURI(badgeId)
    badges.push({
      id: badgeId.toNumber(),
      tokenUri: badgeUri
    })
  }
  return badges
}

export async function getBadgeUri(badgeId) {
  const badge = await getBadgeContract()
  return await badge.tokenURI(badgeId)
}

export async function getBadgeApproved(tokenId) {
  const badge = await getBadgeContract()
  const marketplace = await getMarketplaceContract()
  const approvedAccount = await badge.getApproved(tokenId)
  console.log('approved account', approvedAccount)
  return approvedAccount === marketplace.address

}

export async function callMintBadge(uri) {
  const simpleStorage= await getContract()
  return simpleStorage.connect(getSigner()).mintBadge(uri)
}

export async function callApproveBadge(tokenId) {
  const badge = await getBadgeContract()
  const marketplace = await getMarketplaceContract()
  return badge.connect(getSigner()).approve(marketplace.address, tokenId)
}

export async function callOpenTrade(tokenId, price) {
  const marketplace = await getMarketplaceContract()
  return marketplace.connect(getSigner()).openTrade(tokenId, price)
}

export async function callCancelTrade(tradeId) {
  const marketplace = await getMarketplaceContract()
  return marketplace.connect(getSigner()).cancelTrade(tradeId)
}

export async function callExecuteTrade(tradeId) {
  const marketplace = await getMarketplaceContract()
  return marketplace.connect(getSigner()).executeTrade(tradeId)
}

