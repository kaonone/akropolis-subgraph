import { dataSource } from "@graphprotocol/graph-ts";

import { updateStrategyV1 } from "../entities";

export function handleSetWithdrawalFee(): void {
  let yVaultStrategyAddress = dataSource.address();
  updateStrategyV1(yVaultStrategyAddress);
}
