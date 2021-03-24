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
  return new Contract(addresses[chainId].simpleStorage, abis.simpleStorageV3, provider).deployed()
}

async function getTokenContract() {
  const { chainId } = await getNetwork()
  return new Contract(addresses[chainId].simpleStorageCoin, abis.simpleStorageCoin, provider).deployed()
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

export async function getAuthorizedBalance(address) {
  const simpleStorage= await getContract()
  const simpleStorageCoin = await getTokenContract()
  const allowance = await simpleStorageCoin.allowance(address, simpleStorage.address)
  return allowance.toString()
}

export async function callApprove(inputValue) {
  const simpleStorage= await getContract()
  const simpleStorageCoin = await getTokenContract()
  return simpleStorageCoin.connect(getSigner()).approve(simpleStorage.address, inputValue)
}

