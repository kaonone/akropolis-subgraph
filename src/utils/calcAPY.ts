import { BigInt } from "@graphprotocol/graph-ts";
import { decimalsToWei } from "./decimalsToWei";

let zero = BigInt.fromI32(0);

export function calcAPY(
  duration: BigInt,
  fromAmount: BigInt,
  toAmount: BigInt,
  aprDecimals: number
): BigInt {
  let secondsInYear = 365 * 24 * 60 * 60;

  let apy =
    fromAmount.isZero() || duration.isZero()
      ? BigInt.fromI32(0)
      : toAmount
          .minus(fromAmount)
          .times(decimalsToWei(aprDecimals))
          .times(BigInt.fromI32(secondsInYear))
          .div(fromAmount)
          .div(duration);

  return apy.gt(zero) ? apy : zero;
}
