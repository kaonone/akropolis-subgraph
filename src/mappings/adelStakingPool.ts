import { loadUser } from "../entities";
import { Staked } from "../../generated/ADELStakingPool/StakingPool";

export function handleStaked(event: Staked): void {
  loadUser(event.params.user);
}
