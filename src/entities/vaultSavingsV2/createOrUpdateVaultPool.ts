import { Address, BigInt } from "@graphprotocol/graph-ts";

import { VaultPoolV2 } from "../../../generated/schema";

import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createPoolToken } from "../createPoolToken";
import { createToken } from "../createToken";
import { loadOrCreateVaultControllerV2 } from "./vaultController";
import { YVaultV2 } from "../../../generated/VaultSavingsV2/YVaultV2";
import {
  getStrategyV2Address,
  loadOrCreateVaultStrategyV2,
} from "./vaultStrategy";

export function createOrUpdateVaultPoolV2(
  vaultAddress: Address,
  underlyingTokenAddress: Address
): VaultPoolV2 {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = VaultPoolV2.load(vaultAddress.toHex());
  let yVaultContract = YVaultV2.bind(vaultAddress);
  let controllerAddress = yVaultContract.controller();

  if (!pool) {
    pool = new VaultPoolV2(vaultAddress.toHex());
    pool.totalTVL = BigInt.fromI32(0);
  }

  pool.poolToken = createPoolToken(vaultAddress, null, null, pool.id).id;
  pool.underlyingToken = createToken(underlyingTokenAddress).id;
  pool.controller = loadOrCreateVaultControllerV2(controllerAddress).id;
  pool.strategy = loadOrCreateVaultStrategyV2(
    getStrategyV2Address(controllerAddress, underlyingTokenAddress)
  ).id;
  pool.save();

  return pool as VaultPoolV2;
}
