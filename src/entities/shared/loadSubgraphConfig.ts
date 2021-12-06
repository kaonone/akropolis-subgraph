import { SubgraphConfig } from "../../../generated/schema";
import { SINGLE_ENTITY_ID } from "../../utils";

export function loadSubgraphConfig(): SubgraphConfig {
  let config = SubgraphConfig.load(SINGLE_ENTITY_ID);

  if (!config) {
    config = new SubgraphConfig(SINGLE_ENTITY_ID);

    config.aprDecimals = 8;
    config.save();
  }

  return config as SubgraphConfig;
}
