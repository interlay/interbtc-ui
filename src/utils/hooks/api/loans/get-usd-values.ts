import { BorrowPosition, CurrencyIdLiteral, LendPosition } from "@interlay/interbtc-api";
import Big from "big.js";

import { Prices } from "@/common/types/util.types";
import { convertMonetaryAmountToValueInUSD } from "@/common/utils/utils";
import { getTokenPrice } from "@/utils/helpers/prices";

const getTotalEarnedInterestUSDValue = (lendPositions: LendPosition[], prices: Prices): Big => {
    return lendPositions.reduce((totalValue: Big, position: LendPosition) => {
        const { currency, earnedInterest } = position;
        // TODO: Remove type casting after useGetPrices hook is refactored
        const price = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;

        if (price === undefined) {
            console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${currency.name}`);
        }

        const positionUSDValue = convertMonetaryAmountToValueInUSD(earnedInterest, price);
        return totalValue.add(positionUSDValue || 0);
    }, Big(0));
};

// TODO: use LoanPosition[] type instead after it's exported from the lib
const getTotalUSDValueOfPositions = (positions: BorrowPosition[], prices: Prices): Big => {
    return positions.reduce((totalValue: Big, position: LendPosition | BorrowPosition) => {
        const { currency, amount } = position;
        // TODO: Remove type casting after useGetPrices hook is refactored
        const price = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;

        if (price === undefined) {
            console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${currency.name}`);
        }

        const positionUSDValue = convertMonetaryAmountToValueInUSD(amount, price);
        return totalValue.add(positionUSDValue || 0);
    }, Big(0));
};

export { getTotalEarnedInterestUSDValue, getTotalUSDValueOfPositions }