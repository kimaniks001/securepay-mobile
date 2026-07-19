/**
 * Mapper contract checks — run via: npm run check:api-contract
 * Uses fixtures and mappers without live staging.
 */
import {
  accountReadinessFixture,
  evidenceListFixture,
  groupSecureLinkDetailFixture,
  paymentReadyReviewHoldFixture,
  secureLinkDetailFixture,
  secureLinkListFixture,
  transactionHistoryFixture,
} from './fixtures';
import {
  mapAccountReadiness,
  mapEvidenceList,
  mapGroupSecureLinkDetail,
  mapPaymentReadyReadinessDto,
  mapSecureLinkDetail,
  mapSecureLinkList,
  mapTransactionHistory,
} from './mappers';

const errors: string[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) errors.push(message);
}

function runChecks(): void {
  const list = mapSecureLinkList(secureLinkListFixture);
  assert(list.length === 2, 'secureLinkListFixture should map 2 items');
  assert(list[0]?.feeKes === 10, 'Welfare Group SecureLink fee should be KES 10');

  const pendingDetail = mapSecureLinkDetail(secureLinkDetailFixture);
  assert(
    pendingDetail.moneyState === 'awaiting_payment',
    'pending/initiated must map to awaiting_payment, not paid',
  );

  const group = mapGroupSecureLinkDetail(groupSecureLinkDetailFixture);
  assert(group.contributionSummary.feePerContributionKes === 10, 'Welfare fee doctrine KES 10');
  assert(group.groupTier === 'welfare', 'group_tier snake_case should map');

  const paymentReady = mapPaymentReadyReadinessDto(paymentReadyReviewHoldFixture);
  assert(paymentReady.status === 'review_hold', 'review hold must block readiness display');
  assert(paymentReady.isReady === false, 'Payment Ready must not become payout-ready');

  const nullReady = mapPaymentReadyReadinessDto(null);
  assert(nullReady.status === 'not_ready', 'null readiness should map to not_ready');

  const account = mapAccountReadiness(accountReadinessFixture);
  assert(account.settlementReadiness === 'not_ready', 'missing settlement remains not_ready');

  const history = mapTransactionHistory(transactionHistoryFixture);
  assert(history[0]?.moneyState === 'awaiting_payment', 'pending txn must not be paid');
  assert(history[1]?.moneyState === 'not_ready', 'failed must not count as collected');
  assert(history[2]?.moneyState === 'not_ready', 'reversed must not count as collected');

  const camelDetail = mapSecureLinkDetail({
    moneyState: 'provider_confirmed',
    agreementControlledAmount: 100,
  });
  assert(camelDetail.moneyState === 'provider_confirmed', 'provider_confirmed must remain');

  const generalGroup = mapGroupSecureLinkDetail({
    kind: 'group_securelink',
    groupTier: 'general',
    collectionContributionSummary: {
      feePerContributionKes: 20,
      expectedContributions: 5,
      recordedContributions: 1,
    },
  });
  assert(generalGroup.contributionSummary.feePerContributionKes === 20, 'General fee doctrine KES 20');

  const businessGroup = mapGroupSecureLinkDetail({
    kind: 'group_securelink',
    group_tier: 'business_solution',
    collection_contribution_summary: { fee_per_contribution_kes: 20 },
  });
  assert(businessGroup.contributionSummary.feePerContributionKes === 20, 'Business fee doctrine KES 20');

  const evidence = mapEvidenceList(evidenceListFixture, 'fixture-slug');
  assert(evidence.items.length === 1, 'evidenceListFixture should map 1 item');
  assert(evidence.items[0]?.kind === 'document', 'evidence kind should map');
}

runChecks();

if (errors.length > 0) {
  console.error('API contract mapper checks failed:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log('API contract mapper checks passed.');
