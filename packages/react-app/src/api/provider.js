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

function getSigner() {
  return provider.getSigner()
}

async function getContract() {
  const { chainId } = await getNetwork()
  return new Contract(addresses[chainId], abis.simpleStorageV1, provider).deployed()
}

export async function getContractValue() {
  const localhostSS1 = await getContract()
  return localhostSS1.get()
}

export async function setContractValue(inputValue) {
  const localhostSS1 = await getContract()
  return localhostSS1.connect(getSigner()).set(inputValue)
}
