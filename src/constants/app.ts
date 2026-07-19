import { colors, spacing } from '../constants/theme';
import type { Transaction } from '../types';

export const MOCK_BALANCE = 12450.75;

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    recipient: 'Jane Mwangi',
    amount: 2500,
    currency: 'USD',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    note: 'Rent share',
  },
  {
    id: 'txn_002',
    recipient: 'Safari Tours Ltd',
    amount: 180,
    currency: 'USD',
    status: 'completed',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    note: 'Booking deposit',
  },
  {
    id: 'txn_003',
    recipient: 'Power Utilities',
    amount: 64.2,
    currency: 'USD',
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Monthly bill',
  },
];

export const statusColor: Record<Transaction['status'], string> = {
  completed: colors.success,
  pending: colors.warning,
  failed: colors.error,
};

export const tabBarStyle = {
  backgroundColor: colors.surface,
  borderTopColor: colors.border,
  borderTopWidth: 1,
  height: 64,
  paddingBottom: spacing.sm,
  paddingTop: spacing.sm,
};

export const tabBarActiveTintColor = colors.primary;
export const tabBarInactiveTintColor = colors.textMuted;
