export type TokenContract = {
  name: string;
  symbol: string;
  contractAddress: string;
  deployerAddress: string;
};

export type PayTransaction = {
  from: string;
  to: string;
  amount: number;
  type: string;
  txHash: string;
  dateTime: string;
  tokenContractAddress: string;
  currencySymbol: string;
};

export type TransactionStatus = 'dropped' | 'pending' | 'success';
export type PayTransactionFull = PayTransaction & {
  transactionFee?: string;
  status: TransactionStatus;
  error?: string;
  blockHash?: string;
  blockNumber?: number;
};