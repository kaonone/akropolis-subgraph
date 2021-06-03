import { Address } from "@graphprotocol/graph-ts";

import { SPoolToken } from "../../../generated/schema";
import { ERC20Detailed } from "../../../generated/SavingsModule/ERC20Detailed";

export function createSPoolToken(
  tokenAddress: Address,
  savingsPoolAddress: Address,
): SPoolToken {
  let token = new SPoolToken(tokenAddress.toHex());

  let contract = ERC20Detailed.bind(tokenAddress);

  token.name = contract.name();
  token.decimals = contract.decimals();
  token.symbol = contract.symbol();
  token.savingsPool = savingsPoolAddress.toHex();

  token.save();

  return token;
}
