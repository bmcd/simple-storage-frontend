import { createSlice } from '@reduxjs/toolkit'
import {
  callApproveBadge,
  callCancelTrade,
  callExecuteTrade,
  callMintBadge,
  callOpenTrade,
  getBadgeApproved,
  getBadges,
} from '../../api/provider'
import { setError, setPendingTx } from '../contract/contractSlice'

export const badgeSlice = createSlice({
  name: 'badge',
  initialState: {
    connected: false,
    badges: undefined,
    selectedBadge: undefined,
    approved: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setBadges: (state, action) => {
      state.badges = action.payload
    },
    setSelectedBadge: (state, action) => {
      state.selectedBadge = action.payload
    },
    setApproved: (state, action) => {
      state.approved = action.payload
    },
  },
})

export const chooseBadge = (badge) => async (dispatch, getState) => {
  try {
    const approved = await getBadgeApproved(badge.id)
    dispatch(setSelectedBadge(badge))
    dispatch(setApproved(approved))
  } catch (e) {
    console.log('Could not connect to badge contract. Reason:', e)
    dispatch(setConnected(false))
  }
}


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

export const approveBadge = (badge) => async (dispatch, getState) => {
  dispatch(setPendingTx('SENDING'))
  callApproveBadge(badge.id)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshBadges())
      dispatch(chooseBadge(badge))
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setError(e.message))
      dispatch(setPendingTx(undefined))
    })
}

export const listBadge = (badge, price) => async (dispatch, getState) => {
  dispatch(setPendingTx('SENDING'))
  callOpenTrade(badge.id, price)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshBadges())
      dispatch(setSelectedBadge({}))
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setError(e.message))
      dispatch(setPendingTx(undefined))
    })
}

export const cancelTrade = (trade) => async (dispatch, getState) => {
  dispatch(setPendingTx('SENDING'))
  callCancelTrade(trade.ad)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshBadges())
      dispatch(setSelectedBadge({}))
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setError(e.message))
      dispatch(setPendingTx(undefined))
    })
}

export const executeTrade = (trade) => async (dispatch, getState) => {
  dispatch(setPendingTx('SENDING'))
  callExecuteTrade(trade.ad)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshBadges())
      dispatch(setSelectedBadge({}))
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
  setSelectedBadge,
  setApproved,
} = badgeSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBadge = state => state.badge

export default badgeSlice.reducer
