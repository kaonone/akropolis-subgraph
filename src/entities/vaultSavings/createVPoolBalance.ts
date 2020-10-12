import { ethereum, BigInt } from "@graphprotocol/graph-ts";

import { VPoolBalance } from "../../../generated/schema";
import { getUniqId } from "../../utils/getUniqId";

export function createVPoolBalance(event: ethereum.Event, amount: BigInt, poolId: string): VPoolBalance {
  let balance = new VPoolBalance(getUniqId(event));

  balance.amount = amount;
  balance.date = event.block.timestamp;
  balance.pool = poolId;

  balance.save();

  return balance;
}
