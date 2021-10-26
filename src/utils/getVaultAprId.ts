import { Address, BigInt } from "@graphprotocol/graph-ts";

export function getVaultAprId(
  vaultAddress: Address,
  blockNumber: BigInt
): string {
  return vaultAddress.toHex() + "-" + blockNumber.toString();
}
