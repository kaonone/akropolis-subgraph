import { BigInt } from "@graphprotocol/graph-ts";

import { UserVaultV1TVL } from "../../../generated/schema";

export function loadOrCreateV1TVL(vaultId: string, userId: string): UserVaultV1TVL {
  let tvlAddress = vaultId + userId;
  let tvl = UserVaultV1TVL.load(tvlAddress);

  if (!tvl) {
    tvl = new UserVaultV1TVL(tvlAddress);
    tvl.amount = BigInt.fromI32(0);
    tvl.vault = vaultId;
    tvl.user = userId;
    tvl.save();
  }

  return tvl as UserVaultV1TVL;
}
