import {Change, Trade} from "../types/schema";
import {
  Change as ChangeEvent,
  ChangeV2 as ChangeEventV2
} from "../types/SimpleStorageV2/simpleStorageV2";
import {TradeStatusChange as TradeStatusChangeEvent} from "../types/Marketplace/marketplace";

export function handleChange(event: ChangeEvent): void {
  let change = new Change(event.transaction.hash.toHex())
  change.message = event.params.message
  change.newVal = event.params.newVal
  change.block = event.block.number
  change.save();
}

export function handleChangeV2(event: ChangeEventV2): void {
  let change = new Change(event.transaction.hash.toHex())
  change.message = event.params.message
  change.newVal = event.params.newVal
  change.block = event.block.number
  change.user = event.params.user
  change.save();
}

export function handleTradeStatusChange(event: TradeStatusChangeEvent): void {
  let trade = new Trade(event.params.ad.toHex())
  trade.block = event.block.number
  trade.ad = event.params.ad
  trade.poster = event.params.poster
  trade.tokenId = event.params.tokenId
  trade.price = event.params.price
  trade.status = event.params.status.toString()
  trade.save();
}
