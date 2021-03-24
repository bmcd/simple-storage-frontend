import { combineReducers } from 'redux'
import networkReducer from '../features/network/networkSlice'
import contractReducer from '../features/contract/contractSlice'
import tokenReducer from '../features/token/tokenSlice'

export const rootReducer = combineReducers({
  network: networkReducer,
  contract: contractReducer,
  token: tokenReducer,
})
