import { createSlice } from '@reduxjs/toolkit'
import { callApprove, getAuthorizedBalance, getTokenBalance } from '../../api/provider'
import { setError, setPendingTx } from '../contract/contractSlice'

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    connected: false,
    tokenBalance: undefined,
    authorizedBalance: undefined,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setTokenBalance: (state, action) => {
      state.tokenBalance = action.payload
    },
    setAuthorizedBalance: (state, action) => {
      state.authorizedBalance = action.payload
    },
  },
})

export const refreshToken = () => async (dispatch, getState) => {
  try {
    const address = getState().network.info.selectedAddress
    const tokenBalance = await getTokenBalance(address)
    const authorizedBalance = await getAuthorizedBalance(address)
    dispatch(setTokenBalance(tokenBalance))
    dispatch(setAuthorizedBalance(authorizedBalance))
    dispatch(setConnected(true))
  } catch (e) {
    console.log('Could not connect to token contract. Reason:', e)
    dispatch(setConnected(false))
  }
}

export const authorizeTokens = (amount) => async dispatch => {
  dispatch(setPendingTx('SENDING'))
  callApprove(amount)
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
  setAuthorizedBalance,
} = tokenSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectToken = state => state.token

export default tokenSlice.reducer
