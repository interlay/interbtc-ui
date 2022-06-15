import { Table } from "componentLibrary";
import { CurrencySymbols } from "../../types/currency";
import { CoinPair } from "../CoinPair";

const NewVaultsTable = (): JSX.Element => {
    const renderer; // TODO: implement renderer for each cell.
    const columnLabels = ['Vault Pair', 'Estimated APY', 'Min Collateral', 'Collateral Rate'];
    const rows = [<><CoinPair coinOne={CurrencySymbols.KSM} coinTwo={CurrencySymbols.KBTC} size="small" /> KSM - kBTC</>, ]
    return <Table />
}

export { NewVaultsTable };