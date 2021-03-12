import { Button } from './index'
import React, { useEffect, useState } from 'react'
import { abis, addresses } from '@project/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useSelector } from 'react-redux'
import { selectNetwork } from '../features/network/networkSlice'
import { getContract, getSigner } from '../api/provider'

export default function SimpleStorage ({ }) {

  const network = useSelector(selectNetwork)

  const [connected, setConnected] = useState(false)
  const [currentValue, setCurrentValue] = useState()
  const [newValue, setNewValue] = useState('')
  const [pendingTx, setPendingTx] = useState()

  async function refresh () {
    const localhostSS1 = getContract(network.chainId)
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
    const newValue = BigNumber.from(newValueString)
    const localhostSS1 = getContract(network.chainId)
    localhostSS1.connect(getSigner()).set(newValue)
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
  }, [network])

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

