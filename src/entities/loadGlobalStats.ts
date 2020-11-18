import { BigInt } from "@graphprotocol/graph-ts";

import { GlobalStat } from "../../generated/schema";
import { SINGLE_ENTITY_ID } from "../utils";

export function loadGlobalStat(): GlobalStat {
  let stats = GlobalStat.load(SINGLE_ENTITY_ID);

  if (!stats) {
    stats = new GlobalStat(SINGLE_ENTITY_ID);

    stats.activeMembersCount = 0;
    stats.totalYieldEarned = BigInt.fromI32(0);
    stats.save();
  }

  return stats as GlobalStat;
}
