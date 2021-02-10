import { dataSource } from "@graphprotocol/graph-ts";
import { SetWithdrawalFeeCall } from "../../generated/templates/YVaultStrategyV1/YVaultStrategyV1";

import { updateStrategyV1 } from "../entities";

export function handleSetWithdrawalFee(call: SetWithdrawalFeeCall): void {
  let yVaultStrategyAddress = dataSource.address();
  updateStrategyV1(yVaultStrategyAddress);
}
