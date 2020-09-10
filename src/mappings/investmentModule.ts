import { Address, BigInt, ethereum, dataSource } from "@graphprotocol/graph-ts";

import {
  Withdraw,
  Deposit,
  ProtocolRegistered,
  RewardDistribution,
  InvestmentModule,
} from "../../generated/InvestmentModule/InvestmentModule";
import { DefiProtocol } from "../../generated/InvestmentModule/DefiProtocol";
import {
  createOrUpdateInvestmentPool,
  loadInvestmentPool,
  loadSubgraphConfig,
  createIPoolApr,
  createIReward,
  loadUser,
} from "../entities";
import { calcAPY, addUniq } from "../utils";

export function handleProtocolRegistered(event: ProtocolRegistered): void {
  createOrUpdateInvestmentPool(event, event.params.protocol, event.params.poolToken);
}

export function handleRewardDistribution(event: RewardDistribution): void {
  let investmentModuleAddress = dataSource.address();
  let contract = InvestmentModule.bind(investmentModuleAddress);
  let investmentPoolAddress = contract.protocolByPoolToken(
    event.params.poolToken
  );
  createIReward(event, investmentPoolAddress);
}

export function handleWithdraw(event: Withdraw): void {
  // TODO check user balance and exclude the protocol if balance is zero

  loadUser(event.params.user);
}
export function handleDeposit(event: Deposit): void {
  let user = loadUser(event.params.user);
  user.investmentPools = addUniq(
    user.investmentPools,
    event.params.protocol.toHex()
  );
  user.save();
}
