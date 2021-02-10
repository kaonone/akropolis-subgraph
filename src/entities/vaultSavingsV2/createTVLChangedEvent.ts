import { BigInt, ethereum } from "@graphprotocol/graph-ts";

import { UserVaultV2TVLChanged } from "../../../generated/schema";
import { getUniqId } from "../../utils";

export function createV2TVLChangedEvent(
  event: ethereum.Event,
  amount: BigInt,
  vaultId: string,
  userId: string,
  tvlEventType: string,
): UserVaultV2TVLChanged {
  let tvlChangedEvent = new UserVaultV2TVLChanged(getUniqId(event));

  tvlChangedEvent.amount = amount;
  tvlChangedEvent.blockNumber = event.block.number;
  tvlChangedEvent.date = event.block.timestamp.toI32();
  tvlChangedEvent.vault = vaultId;
  tvlChangedEvent.user = userId;
  tvlChangedEvent.eventType = tvlEventType;

  tvlChangedEvent.save();

  return tvlChangedEvent as UserVaultV2TVLChanged;
}
