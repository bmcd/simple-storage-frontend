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

export function getSigner() {
  return provider.getSigner()
}

export function getContract(chainId) {
  return new Contract(addresses[chainId], abis.simpleStorageV1, provider)
}
