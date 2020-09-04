import { ethereum, BigInt } from "@graphprotocol/graph-ts";

import { IPoolApr } from "../../../generated/schema";
import { getUniqId } from "../../utils/getUniqId";

export function createIPoolApr(
  event: ethereum.Event,
  duration: BigInt,
  amount: BigInt,
  poolId: string
): IPoolApr {
  let apr = new IPoolApr(getUniqId(event));

  apr.amount = amount;
  apr.duration = duration;
  apr.date = event.block.timestamp;
  apr.pool = poolId;

  apr.save();

  return apr;
}
