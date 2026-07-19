import { forbiddenPublicTerms } from './securepayDoctrine';

export const forbiddenMobileUiPhrases = [
  ...forbiddenPublicTerms,
  'withdraw now',
  'cash out',
  'instant payout',
  'payment completed',
  'money released',
  'frozen',
  'fake payment complete',
  'funds released',
  'escrow',
  'custody',
  'guaranteed payout',
  'send money instantly',
  'ready to withdraw',
  'ready for payout',
  'settlement complete',
  'release button',
  'withdraw button',
  'payout button',
] as const;

export class UnsafeMobileUiTextError extends Error {
  constructor(
    message: string,
    public readonly matchedPhrase: string,
  ) {
    super(message);
    this.name = 'UnsafeMobileUiTextError';
  }
}

export function findUnsafeUiPhrase(text: string): string | null {
  const normalized = text.toLowerCase();
  for (const phrase of forbiddenMobileUiPhrases) {
    if (normalized.includes(phrase.toLowerCase())) {
      return phrase;
    }
  }
  return null;
}

export function assertSafeUiTextForMobile(text: string, context = 'mobile UI'): void {
  const matched = findUnsafeUiPhrase(text);
  if (matched) {
    throw new UnsafeMobileUiTextError(
      `Unsafe ${context} copy detected: "${matched}" in "${text}"`,
      matched,
    );
  }
}

export function isSafeUiTextForMobile(text: string): boolean {
  return findUnsafeUiPhrase(text) === null;
}
