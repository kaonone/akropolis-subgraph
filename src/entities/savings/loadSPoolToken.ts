import { Address } from "@graphprotocol/graph-ts";

import { SPoolToken } from "../../../generated/schema";

export function loadSPoolToken(address: Address): SPoolToken | null {
  return SPoolToken.load(address.toHex());
}
