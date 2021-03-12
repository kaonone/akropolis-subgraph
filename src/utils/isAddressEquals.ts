import { Address } from "@graphprotocol/graph-ts";

export function isAddressEquals(
  poolAddress: Address,
  addresses: Address[]
): bool {
  return addresses.some((address) => address.equals(poolAddress));
}
