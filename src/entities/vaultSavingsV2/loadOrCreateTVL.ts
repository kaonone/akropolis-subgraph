import { BigInt } from "@graphprotocol/graph-ts";

import { UserVaultV2TVL } from "../../../generated/schema";

export function loadOrCreateV2TVL(vaultId: string, userId: string): UserVaultV2TVL {
  let tvlAddress = vaultId + userId;
  let tvl = UserVaultV2TVL.load(tvlAddress);

  if (!tvl) {
    tvl = new UserVaultV2TVL(tvlAddress);
    tvl.amount = BigInt.fromI32(0);
    tvl.vault = vaultId;
    tvl.user = userId;
    tvl.save();
  }

  return tvl as UserVaultV2TVL;
}
