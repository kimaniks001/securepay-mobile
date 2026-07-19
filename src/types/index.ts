export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type Transaction = {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  note?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type AuthSession = {
  token: string;
  user: UserProfile;
  expiresAt: string;
};
