import { createSlice } from '@reduxjs/toolkit'
import {
  callMintBadge,
  getBadges,
} from '../../api/provider'
import { setError, setPendingTx } from '../contract/contractSlice'

export const badgeSlice = createSlice({
  name: 'badge',
  initialState: {
    connected: false,
    badges: undefined,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setBadges: (state, action) => {
      state.badges = action.payload
    },
  },
})

export const refreshBadges = () => async (dispatch, getState) => {
  try {
    const address = getState().network.info.selectedAddress
    const badges = await getBadges(address)
    dispatch(setBadges(badges))
    dispatch(setConnected(true))
  } catch (e) {
    console.log('Could not connect to badge contract. Reason:', e)
    dispatch(setConnected(false))
  }
}

export const mintBadge = (uri) => async (dispatch, getState) => {
  dispatch(setPendingTx('SENDING'))
  callMintBadge(uri)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshBadges())
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setError(e.message))
      dispatch(setPendingTx(undefined))
    })
}

export const {
  setConnected,
  setBadges,
} = badgeSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBadge = state => state.badge

export default badgeSlice.reducer
