import { combineReducers } from 'redux'
import networkReducer from '../features/network/networkSlice'

export const rootReducer = combineReducers({
  network: networkReducer,
})
