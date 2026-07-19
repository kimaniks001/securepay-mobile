export type JourneyStep = {
  id: string;
  label: string;
  explanation: string;
};

export type MobileJourney = {
  id: string;
  title: string;
  steps: JourneyStep[];
};

export const welcomeJourney: MobileJourney = {
  id: 'welcome',
  title: 'Welcome',
  steps: [
    {
      id: 'brand',
      label: 'SecurePay by Keyman',
      explanation: 'Money should follow the agreement. Trade freely. Fairness built in.',
    },
    {
      id: 'demo',
      label: 'Continue in demo mode',
      explanation: 'Explore SecureLinks with mock data. No live money movement.',
    },
    {
      id: 'learn',
      label: 'Learn how SecurePay works',
      explanation: 'Agreement-backed payments with backend as the source of truth.',
    },
  ],
};

export const secureLinkCreateJourney: MobileJourney = {
  id: 'securelink-create',
  title: 'Create SecureLink',
  steps: [
    {
      id: 'agreement',
      label: 'Agreement',
      explanation: 'Title, purpose, and agreement-controlled amount.',
    },
    {
      id: 'parties',
      label: 'Parties',
      explanation: 'Creator KSNumber and other party placeholder.',
    },
    {
      id: 'conditions',
      label: 'Conditions',
      explanation: 'Release conditions, evidence, and deadline placeholder.',
    },
    {
      id: 'preview',
      label: 'Preview',
      explanation: 'Review draft summary. Draft only in Phase 2B.',
    },
    {
      id: 'share',
      label: 'Share placeholder',
      explanation: 'Sharing is disabled in demo. Backend submission required later.',
    },
  ],
};

export const groupSecureLinkCreateJourney: MobileJourney = {
  id: 'group-securelink-create',
  title: 'Create Group SecureLink',
  steps: [
    {
      id: 'purpose',
      label: 'Purpose',
      explanation: 'Describe the group agreement and contribution goal.',
    },
    {
      id: 'category',
      label: 'Category',
      explanation: 'Welfare, General, or Business solution with fee doctrine.',
    },
    {
      id: 'organizer',
      label: 'Organizer',
      explanation: 'Organizer KSNumber placeholder for the group lead.',
    },
    {
      id: 'governance',
      label: 'Governance',
      explanation: 'Approvers and minimum approvals placeholder.',
    },
    {
      id: 'fee',
      label: 'Fee doctrine',
      explanation: 'KES 10 welfare / KES 20 general and business per contribution.',
    },
    {
      id: 'preview',
      label: 'Preview',
      explanation: 'Governance summary and readiness note. No live collection claim.',
    },
  ],
};

export const secureLinkStatusJourney: MobileJourney = {
  id: 'securelink-status',
  title: 'SecureLink status',
  steps: [
    {
      id: 'summary',
      label: 'Agreement summary',
      explanation: 'Title, amount, and parties overview.',
    },
    {
      id: 'provider',
      label: 'Provider confirmation',
      explanation: 'Shown as readiness state, never confirmed from mobile.',
    },
    {
      id: 'evidence',
      label: 'Evidence',
      explanation: 'Agreement evidence placeholder from backend.',
    },
    {
      id: 'release',
      label: 'Release conditions',
      explanation: 'Conditions required before backend movement.',
    },
    {
      id: 'readiness',
      label: 'Payment Ready readiness',
      explanation: 'Readiness only — not payout or withdrawal.',
    },
    {
      id: 'activity',
      label: 'Activity',
      explanation: 'Timeline of safe activity labels.',
    },
  ],
};

export const readinessJourney: MobileJourney = {
  id: 'readiness',
  title: 'Payment Ready readiness',
  steps: [
    {
      id: 'status',
      label: 'Readiness status',
      explanation: 'Ready for staging review, not ready, or governance incomplete.',
    },
    {
      id: 'review',
      label: 'Review hold',
      explanation: 'Active review hold when backend requires it.',
    },
    {
      id: 'settlement',
      label: 'Settlement readiness',
      explanation: 'Pending backend settlement checks.',
    },
    {
      id: 'ledger',
      label: 'Ledger posting pending',
      explanation: 'Backend ledger readiness — never posted from mobile.',
    },
  ],
};

export const accountReadinessJourney: MobileJourney = {
  id: 'account-readiness',
  title: 'Account readiness',
  steps: [
    {
      id: 'ksnumber',
      label: 'KSNumber',
      explanation: 'Your SecurePay identity placeholder.',
    },
    {
      id: 'activation',
      label: 'Activation status',
      explanation: 'Demo activation placeholder until backend sync.',
    },
    {
      id: 'settlement',
      label: 'Settlement readiness',
      explanation: 'Backend-controlled settlement state.',
    },
    {
      id: 'wallet',
      label: 'SecurePay Wallet placeholder',
      explanation: 'Not a live wallet. No withdrawal or cash-out.',
    },
  ],
};

export const mobileJourneys = {
  welcomeJourney,
  secureLinkCreateJourney,
  groupSecureLinkCreateJourney,
  secureLinkStatusJourney,
  readinessJourney,
  accountReadinessJourney,
} as const;
