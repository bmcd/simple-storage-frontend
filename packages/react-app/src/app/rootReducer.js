import { combineReducers } from 'redux'
import networkReducer from '../features/network/networkSlice'
import contractReducer from '../features/contract/contractSlice'
import tokenReducer from '../features/token/tokenSlice'
import badgeReducer from '../features/badge/badgeSlice'

export const rootReducer = combineReducers({
  network: networkReducer,
  contract: contractReducer,
  token: tokenReducer,
  badge: badgeReducer,
})
