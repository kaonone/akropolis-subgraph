import { Address, BigInt } from "@graphprotocol/graph-ts";

import { VaultPool } from "../../../generated/schema";

import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createPoolToken } from "../createPoolToken";
import { createToken } from "../createToken";
import { loadOrCreateVaultController } from "./vaultController";
import { YVault } from "../../../generated/VaultSavingsModule/YVault";
import { getStrategyAddress, loadOrCreateVaultStrategy } from "./vaultStrategy";

export function createOrUpdateVaultPool(
  vaultAddress: Address,
  underlyingTokenAddress: Address
): VaultPool {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = VaultPool.load(vaultAddress.toHex());
  let yVaultContract = YVault.bind(vaultAddress);
  let controllerAddress = yVaultContract.controller();

  if (!pool) {
    pool = new VaultPool(vaultAddress.toHex());
    pool.totalTVL = BigInt.fromI32(0);
  }

  pool.poolToken = createPoolToken(vaultAddress, null, pool.id).id;
  pool.underlyingToken = createToken(underlyingTokenAddress).id;
  pool.controller = loadOrCreateVaultController(controllerAddress).id;
  pool.strategy = loadOrCreateVaultStrategy(
    getStrategyAddress(controllerAddress, underlyingTokenAddress)
  ).id;
  pool.save();

  return pool as VaultPool;
}
