import { createSlice } from '@reduxjs/toolkit'
import { getNetwork, getProviderInfo } from '../../api/provider'

export const networkSlice = createSlice({
  name: 'network',
  initialState: {
    info: {},
  },
  reducers: {
    update: (state, action) => {
      state.info = action.payload
    },
  },
})

export const fetchNetwork = () => async dispatch => {
  await getNetwork()
    .then(function ({chainId, ensAddress, name }) {
      dispatch(update({
        name,
        chainId,
        ensAddress,
        // extra info like isMetaMask and the current selected address
        ...getProviderInfo(),
      }))
    })
    .catch(e => console.log('error', e))
}

export const { update } = networkSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNetwork = state => state.network.info

export default networkSlice.reducer
