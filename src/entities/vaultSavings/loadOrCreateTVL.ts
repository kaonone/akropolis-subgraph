import { BigInt } from "@graphprotocol/graph-ts";

import { UserVaultTVL } from "../../../generated/schema";

export function loadOrCreateTVL(vaultId: string, userId: string): UserVaultTVL {
  let tvlAddress = vaultId + userId;
  let tvl = UserVaultTVL.load(tvlAddress);

  if (!tvl) {
    tvl = new UserVaultTVL(vaultId + userId);
    tvl.amount = BigInt.fromI32(0);
    tvl.vault = vaultId;
    tvl.user = userId;
    tvl.save();
  }

  return tvl as UserVaultTVL;
}
