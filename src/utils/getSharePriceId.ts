import { Address, BigInt } from "@graphprotocol/graph-ts";

const secondsInDay = BigInt.fromI32(24 * 60 * 60);

export function getSharePriceId(
  vaultAddress: Address,
  blockDate: BigInt
): string {
  return vaultAddress.toHex() + "-" + blockDate.div(secondsInDay).toString();
}
