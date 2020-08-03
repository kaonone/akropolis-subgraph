import { BigInt } from "@graphprotocol/graph-ts";

export function decimalsToWei(decimals: f64): BigInt {
  return BigInt.fromI32(10).pow(decimals as u8);
}
