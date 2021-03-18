import {Change} from "../types/schema";
import {
  Change as ChangeEvent,
  ChangeV2 as ChangeEventV2
} from "../types/SimpleStorageV2/simpleStorageV2";
import {BigInt, Bytes} from "@graphprotocol/graph-ts";

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
