import { createSlice } from '@reduxjs/toolkit'
import { callApprove, getAuthorizedBalance, getTokenBalance } from '../../api/provider'
import { setError, setPendingTx } from '../contract/contractSlice'

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    connected: false,
    tokenBalance: undefined,
    storageBalance: undefined,
    marketplaceBalance: undefined,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setTokenBalance: (state, action) => {
      state.tokenBalance = action.payload
    },
    setStorageBalance: (state, action) => {
      state.storageBalance = action.payload
    },
    setMarketplaceBalance: (state, action) => {
      state.marketplaceBalance = action.payload
    },
  },
})

export const refreshToken = () => async (dispatch, getState) => {
  try {
    const address = getState().network.info.selectedAddress
    const tokenBalance = await getTokenBalance(address)
    const storageBalance = await getAuthorizedBalance(address, 'storage')
    const marketplaceBalance = await getAuthorizedBalance(address, 'marketplace')
    dispatch(setTokenBalance(tokenBalance))
    dispatch(setStorageBalance(storageBalance))
    dispatch(setMarketplaceBalance(marketplaceBalance))
    dispatch(setConnected(true))
  } catch (e) {
    console.log('Could not connect to token contract. Reason:', e)
    dispatch(setConnected(false))
  }
}
export const authorizeMarketplaceTokens = (amount) => {
  return authorizeTokens(amount, 'marketplace')
}

export const authorizeStorageTokens = (amount) => {
  return authorizeTokens(amount, 'storage')
}

export const authorizeTokens = (amount, contract) => async dispatch => {
  dispatch(setPendingTx('SENDING'))
  callApprove(amount, contract)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshToken())
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setError(e.message))
      dispatch(setPendingTx(undefined))
    })
}

export const {
  setTokenBalance,
  setConnected,
  setStorageBalance,
  setMarketplaceBalance,
} = tokenSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectToken = state => state.token

export default tokenSlice.reducer
