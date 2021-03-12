import { useSelector } from 'react-redux'
import React from 'react'
import { selectNetwork } from './networkSlice'

export function NetworkInfo () {
  const { name, chainId, isMetaMask, selectedAddress } = useSelector(selectNetwork)

  if (!chainId) {
    return <div>Not connected</div>
  }
  return <div>
    <div>Connected{isMetaMask && ' (via MetaMask)'}: {name === 'unknown' ? 'Unknown Network' : name} ({chainId})</div>
    <div>Address: {selectedAddress}</div>
  </div>
}
