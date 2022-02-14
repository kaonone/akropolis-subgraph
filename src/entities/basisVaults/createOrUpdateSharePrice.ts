import { Address, BigInt } from "@graphprotocol/graph-ts";
import { BasisVault, SharePrice } from "../../../generated/schema";
import { getSharePriceId } from "../../utils/getSharePriceId";
import { BasisVault as BasisVaultContract } from "../../../generated/templates/BasisVault/BasisVault";
import { loadToken } from "../shared";

export function createOrUpdateSharePrice(
  basisVaultAddress: Address,
  blockDate: BigInt
): SharePrice {
  let sharePrice = SharePrice.load(
    getSharePriceId(basisVaultAddress, blockDate)
  );

  if (!sharePrice) {
    sharePrice = new SharePrice(getSharePriceId(basisVaultAddress, blockDate));

    let weekAgoPriceId = SharePrice.load(
      getSharePriceId(
        basisVaultAddress,
        blockDate.minus(BigInt.fromI32(7 * 24 * 60 * 60))
      )
    );
    let twoWeeksAgoPriceId = SharePrice.load(
      getSharePriceId(
        basisVaultAddress,
        blockDate.minus(BigInt.fromI32(14 * 24 * 60 * 60))
      )
    );
    let monthAgoPriceId = SharePrice.load(
      getSharePriceId(
        basisVaultAddress,
        blockDate.minus(BigInt.fromI32(30 * 24 * 60 * 60))
      )
    );

    sharePrice.vault = basisVaultAddress.toHex();
    sharePrice.weekAgo = weekAgoPriceId ? weekAgoPriceId.id : null;
    sharePrice.twoWeeksAgo = twoWeeksAgoPriceId ? twoWeeksAgoPriceId.id : null;
    sharePrice.monthAgo = monthAgoPriceId ? monthAgoPriceId.id : null;
  }

  let depositTokenDecimals = getDepositTokenDecimals(basisVaultAddress);
  let priceMultiplier = BigInt.fromI32(10).pow(depositTokenDecimals as u8);

  let contract = BasisVaultContract.bind(basisVaultAddress);
  let totalAssets = contract.totalAssets();
  let totalSupply = contract.totalSupply();

  sharePrice.price = totalSupply.isZero()
    ? priceMultiplier
    : totalAssets.times(priceMultiplier).div(totalSupply);
  sharePrice.updatedAt = blockDate;
  sharePrice.save();

  return sharePrice as SharePrice;
}

function getDepositTokenDecimals(basisVaultAddress: Address): number {
  let vault = BasisVault.load(basisVaultAddress.toHex());

  let depositTokenAddress: Address;
  if (vault) {
    depositTokenAddress = Address.fromString(vault.depositToken);
  } else {
    let contract = BasisVaultContract.bind(basisVaultAddress);
    depositTokenAddress = contract.want();
  }

  let token = loadToken(depositTokenAddress);

  return token.decimals;
}
