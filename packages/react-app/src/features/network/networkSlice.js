import { createSlice } from '@reduxjs/toolkit'

export const networkSlice = createSlice({
  name: 'network',
  initialState: {
  },
  reducers: {
    update: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    },
  },
})

export const fetchNetwork = () => async dispatch => {
  // getNetwork()
  //   .then(function (response) {
  //     dispatch(update(response))
  //   })
  //   .catch(e => console.log('error', e))
}

export const { update } = networkSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNetwork = state => state.network

export default networkSlice.reducer
