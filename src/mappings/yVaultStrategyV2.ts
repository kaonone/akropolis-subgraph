import { dataSource } from "@graphprotocol/graph-ts";

import { updateStrategyV2 } from "../entities";

export function handleSetWithdrawalFee(): void {
  let yVaultStrategyAddress = dataSource.address();
  updateStrategyV2(yVaultStrategyAddress);
}
