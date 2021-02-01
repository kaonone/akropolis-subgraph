import { dataSource } from "@graphprotocol/graph-ts";
import { SetWithdrawalFeeCall } from "../../generated/templates/YVaultStrategy/YVaultStrategy";

import { updateStrategy } from "../entities";

export function handleSetWithdrawalFee(call: SetWithdrawalFeeCall): void {
  let yVaultStrategyAddress = dataSource.address();
  updateStrategy(yVaultStrategyAddress);
}
