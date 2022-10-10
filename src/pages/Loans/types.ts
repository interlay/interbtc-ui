type Lend = 'lend';

type Borrow = 'borrow';

type LoanType = Lend | Borrow;

type SupplyAction = Lend | 'withdraw';

type BorrowAction = Borrow | 'repay';

type LoanAction = SupplyAction | BorrowAction;

export type { BorrowAction, LoanAction, LoanType, SupplyAction };
