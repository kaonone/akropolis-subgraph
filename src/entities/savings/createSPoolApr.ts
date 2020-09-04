import { ethereum, BigInt } from "@graphprotocol/graph-ts";

import { SPoolApr } from "../../../generated/schema";
import { getUniqId } from "../../utils/getUniqId";

export function createSPoolApr(
  event: ethereum.Event,
  duration: BigInt,
  amount: BigInt,
  poolId: string
): SPoolApr {
  let apr = new SPoolApr(getUniqId(event));

  apr.amount = amount;
  apr.duration = duration;
  apr.date = event.block.timestamp;
  apr.pool = poolId;

  apr.save();

  return apr;
}
