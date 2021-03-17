import { createSlice } from '@reduxjs/toolkit'
import {
  getAddressValue,
  getContractValue,
  callSetAddressValue,
  callSetContractValue
} from '../../api/provider'

export const contractSlice = createSlice({
  name: 'contract',
  initialState: {
    connected: false,
    value: undefined,
    pendingTx: undefined,
    error: undefined,
    personalError: undefined,
    address: undefined,
    addressValue: undefined,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setValue: (state, action) => {
      state.value = action.payload
    },
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setAddressValue: (state, action) => {
      state.addressValue = action.payload
    },
    setPendingTx: (state, action) => {
      state.pendingTx = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setPersonalError: (state, action) => {
      state.personalError = action.payload
    },
  },
})

export const refreshContract = () => async dispatch => {
  try {
    const storageValue = await getContractValue()
    dispatch(setValue(storageValue.toNumber()))
    dispatch(setConnected(true))
  } catch (e) {
    console.log('Could not connect to contract. Reason:', e)
    dispatch(setConnected(false))
  }
}

export const findAddress = (address) => async dispatch => {
  dispatch(setAddress(address))
  dispatch(refreshAddressValue())
}

export const refreshAddressValue = () => async (dispatch, getState) => {
  try {
    const addressValue = await getAddressValue(getState().contract.address)
    dispatch(setAddressValue(addressValue.toNumber()))
    dispatch(setConnected(true))
  } catch (e) {
    console.log('Could not connect to contract. Reason:', e)
    dispatch(setConnected(false))
  }
}


export const setNewValue = (inputValue) => async dispatch => {
  dispatch(setPendingTx('SENDING'))
  callSetContractValue(inputValue)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshContract())
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setError(e.message))
      dispatch(setPendingTx(undefined))
    })
}

export const setNewAddressValue = (inputValue) => async dispatch => {
  dispatch(setPendingTx('SENDING'))
  callSetAddressValue(inputValue)
    .then((res) => {
      dispatch(setPendingTx(res.hash))
      return res.wait()
    })
    .then((res) => {
      dispatch(setPendingTx(undefined))
      dispatch(refreshAddressValue())
    })
    .catch(e => {
      console.error('error sending transaction', e)
      dispatch(setPersonalError(e.message))
      dispatch(setPendingTx(undefined))
    })
}


export const { setConnected, setValue, setAddress, setAddressValue, setPendingTx, setError, setPersonalError } = contractSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectContract = state => state.contract

export default contractSlice.reducer
