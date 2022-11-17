import { LoanAction } from '@/types/loans';

const isLendAsset = (action: LoanAction): boolean => action === 'lend' || action === 'withdraw';

const isBorrowAsset = (action: LoanAction): boolean => action === 'borrow' || action === 'repay';

export { isBorrowAsset, isLendAsset };
