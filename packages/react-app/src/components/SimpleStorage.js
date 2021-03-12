import { Button } from './index'
import React, { useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import { abis, addresses } from '@project/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export default function SimpleStorage ({ provider }) {

  const [connected, setConnected] = useState(false)
  const [currentValue, setCurrentValue] = useState()
  const [newValue, setNewValue] = useState('')
  const [pendingTx, setPendingTx] = useState()

  async function refresh () {
    const network = await provider.getNetwork()
    const localhostSS1 = new Contract(addresses[network.chainId], abis.simpleStorageV1, provider)
    console.log('Connecting to contract at', addresses[network.chainId], 'on network with id:', network.chainId)
    try {
      await localhostSS1.deployed()
      const storageValue = await localhostSS1.get()
      setCurrentValue(storageValue.toNumber())
      setConnected(true)
    } catch (e) {
      console.log('Could not connect to contract at', addresses[network.chainId], 'Reason:', e)
      setConnected(false)
    }
  }

  async function set (newValueString) {
    if(!newValueString) {
      return
    }
    setPendingTx('SENDING')
    setNewValue('')
    const network = await provider.getNetwork()
    const newValue = BigNumber.from(newValueString)
    const localhostSS1 = new Contract(addresses[network.chainId], abis.simpleStorageV1, provider)
    localhostSS1.connect(provider.getSigner()).set(newValue)
      .then((res) => {
        console.log('waiting for tx with hash', res.hash)
        setPendingTx(res.hash)
        return res.wait()
      })
      .then((res) => {
        console.log('tx complete', res)
        setPendingTx(undefined)
        refresh()
      })
      .catch(e => {
        console.error('error sending transaction', e)
        setPendingTx(undefined)
      })
  }


  useEffect(() => {
    refresh()
  }, [provider])

  if(!connected) {
    return <div>Not connected to contract.</div>
  }

  return <div>
    <div>
      Current Value: {currentValue}
    </div>
    <Button onClick={() => refresh()}>
      Refresh
    </Button>
    <div>
      <input type="number" value={newValue} onChange={(event) => setNewValue(event.target.value)}/>
      <Button
        disabled={pendingTx}
        onClick={() => set(newValue)}>
        {pendingTx ? 'Waiting...' : 'Set' }
      </Button>
    </div>
    {pendingTx === 'SENDING' ? 'Sending...' : pendingTx && <div>Waiting for transaction to complete: {pendingTx}</div>}
  </div>
}

