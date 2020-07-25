import { ethereum, BigInt } from "@graphprotocol/graph-ts";

import { SPoolBalance } from "../../generated/schema";
import { getUniqId } from "../utils/getUniqId";

export function createSPoolBalance(event: ethereum.Event, amount: BigInt, poolId: string): SPoolBalance {
  let balance = new SPoolBalance(getUniqId(event));

  balance.amount = amount;
  balance.date = event.block.timestamp;
  balance.pool = poolId;

  balance.save();

  return balance;
}
