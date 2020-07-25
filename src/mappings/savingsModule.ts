import {
  // Withdraw,
  // Deposit,
  ProtocolRegistered,
} from "../../generated/SavingsModule/SavingsModule";
import { createSavingsPool } from "../entities/createSavingsPool";

export function handleProtocolRegistered(event: ProtocolRegistered): void {
  createSavingsPool(event, event.params.protocol, event.params.poolToken);
}
