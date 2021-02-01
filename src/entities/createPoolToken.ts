import { Address } from "@graphprotocol/graph-ts";

import { PoolToken } from "../../generated/schema";
import { ERC20Detailed } from "../../generated/SavingsModule/ERC20Detailed";

export function createPoolToken(
  tokenAddress: Address,
  savingsPool: string | null,
  vaultPool: string | null
): PoolToken {
  let token = new PoolToken(tokenAddress.toHex());

  let contract = ERC20Detailed.bind(tokenAddress);

  token.name = contract.name();
  token.decimals = contract.decimals();
  token.symbol = contract.symbol();
  token.savingsPool = savingsPool;
  token.vaultPool = vaultPool;

  token.save();

  return token;
}
