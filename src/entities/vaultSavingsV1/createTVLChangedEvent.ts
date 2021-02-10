import { BigInt, ethereum } from "@graphprotocol/graph-ts";

import { UserVaultV1TVLChanged } from "../../../generated/schema";
import { getUniqId } from "../../utils";

export function createV1TVLChangedEvent(
  event: ethereum.Event,
  amount: BigInt,
  vaultId: string,
  userId: string,
  tvlEventType: string,
): UserVaultV1TVLChanged {
  let tvlChangedEvent = new UserVaultV1TVLChanged(getUniqId(event));

  tvlChangedEvent.amount = amount;
  tvlChangedEvent.blockNumber = event.block.number;
  tvlChangedEvent.date = event.block.timestamp.toI32();
  tvlChangedEvent.vault = vaultId;
  tvlChangedEvent.user = userId;
  tvlChangedEvent.eventType = tvlEventType;

  tvlChangedEvent.save();

  return tvlChangedEvent as UserVaultV1TVLChanged;
}
