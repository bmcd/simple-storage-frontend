import { Change } from "../types/schema";
import { Change as ChangeEvent } from "../types/SimpleStorageV1/simpleStorageV1";

export function handleChange(event: ChangeEvent): void {
  let transactionHash = event.transaction.hash.toHex()
  let blockNumber = event.block.number
  let change = new Change(transactionHash)
  change.message = event.params.message
  change.newVal = event.params.newVal
  change.block = blockNumber
  change.save();
}
