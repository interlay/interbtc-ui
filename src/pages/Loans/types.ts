type Lend = 'lend';

type Borrow = 'borrow';

type LoanType = Lend | Borrow;

type LendAction = Lend | 'withdraw';

type BorrowAction = Borrow | 'repay';

type LoanAction = LendAction | BorrowAction;

export type { BorrowAction, LendAction, LoanAction, LoanType };
