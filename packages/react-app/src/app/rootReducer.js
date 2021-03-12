import { combineReducers } from 'redux'
import networkReducer from '../features/network/networkSlice'
import contractReducer from '../features/contract/contractSlice'

export const rootReducer = combineReducers({
  network: networkReducer,
  contract: contractReducer,
})
