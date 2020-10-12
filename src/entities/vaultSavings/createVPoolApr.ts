import { ethereum, BigInt } from "@graphprotocol/graph-ts";

import { VPoolApr } from "../../../generated/schema";
import { getUniqId } from "../../utils/getUniqId";

export function createVPoolApr(
  event: ethereum.Event,
  duration: BigInt,
  amount: BigInt,
  poolId: string
): VPoolApr {
  let apr = new VPoolApr(getUniqId(event));

  apr.txHash = event.transaction.hash;
  apr.amount = amount;
  apr.duration = duration;
  apr.date = event.block.timestamp;
  apr.pool = poolId;

  apr.save();

  return apr;
}
