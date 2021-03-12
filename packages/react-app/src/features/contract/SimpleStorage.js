import React, { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import { Button } from '../../components'
import {
  refreshContract,
  selectContract,
  setError,
  setNewValue,
} from './contractSlice'

export default function SimpleStorage () {

  const dispatch = useDispatch()
  const network = useSelector(selectNetwork)
  const { connected, error, pendingTx, value } = useSelector(selectContract)

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    dispatch(refreshContract())
  }, [network])

  if(!connected) {
    return <div>Not connected to contract.</div>
  }

  return <div>
    <div>
      Current Value: {value}
    </div>
    <Button onClick={() => dispatch(refreshContract())}>
      Refresh
    </Button>
    <div>
      <input type="number" value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
      <Button
        disabled={pendingTx}
        onClick={() => {
          try {
            dispatch(setNewValue(BigNumber.from(inputValue)))
            dispatch(setError(undefined))
          } catch (e) {
            console.error(e)
            dispatch(setError('Input must be an integer'))
          }
        }}>
        {pendingTx ? 'Waiting...' : 'Set' }
      </Button>
    </div>
    {error && error}
    {pendingTx === 'SENDING' ? 'Sending...' : pendingTx && <div>Waiting for transaction to complete: {pendingTx}</div>}
  </div>
}

