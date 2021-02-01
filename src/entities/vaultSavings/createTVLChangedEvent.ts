import { BigInt, ethereum } from "@graphprotocol/graph-ts";

import { UserVaultTVLChanged } from "../../../generated/schema";
import { getUniqId } from "../../utils";

export function createTVLChangedEvent(
  event: ethereum.Event,
  amount: BigInt,
  vaultId: string,
  userId: string,
  tvlEventType: string,
): UserVaultTVLChanged {
  let tvlChangedEvent = new UserVaultTVLChanged(getUniqId(event));

  tvlChangedEvent.amount = amount;
  tvlChangedEvent.blockNumber = event.block.number;
  tvlChangedEvent.vault = vaultId;
  tvlChangedEvent.user = userId;
  tvlChangedEvent.eventType = tvlEventType;

  tvlChangedEvent.save();

  return tvlChangedEvent as UserVaultTVLChanged;
}
