import { dataSource } from "@graphprotocol/graph-ts";

import { updateStrategy } from "../entities";

export function handleSetWithdrawalFee(): void {
  let yVaultStrategyAddress = dataSource.address();
  updateStrategy(yVaultStrategyAddress);
}
