import { Button } from './index'
import React, { useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import { abis, addresses } from '@project/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export default function SimpleStorage ({ provider }) {

  const [currentValue, setCurrentValue] = useState()
  const [newValue, setNewValue] = useState('')

  async function refresh () {
    const network = await provider.getNetwork()
    const localhostSS1 = new Contract(addresses[network.chainId], abis.simpleStorageV1, provider)
    const storageValue = await localhostSS1.get()
    setCurrentValue(storageValue.toNumber())
  }

  async function set (newValueString) {
    const network = await provider.getNetwork()
    const newValue = BigNumber.from(newValueString)
    const localhostSS1 = new Contract(addresses[network.chainId], abis.simpleStorageV1, provider)
    localhostSS1.connect(provider.getSigner()).set(newValue)
  }


  useEffect(() => {
    refresh()
  }, [provider])

  return <div>
    <div>
      Current Value: {currentValue}
      <Button onClick={() => refresh()}>
        Refresh
      </Button>
    </div>
    <div>
      <input type="number" value={newValue} onChange={(event) => setNewValue(event.target.value)}/>
      <Button onClick={() => set(newValue)}>
        Set
      </Button>
    </div>
  </div>
}

