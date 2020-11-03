import { Address } from "@graphprotocol/graph-ts";

import { PoolToken } from "../../generated/schema";
import { createPoolToken } from "./createPoolToken";

export function loadPoolToken(address: Address): PoolToken {
  let token = PoolToken.load(address.toHex());

  if (!token) {
    return createPoolToken(address, null, null);
  }

  return token as PoolToken;
}
