# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Cursor Cloud specific instructions

SecurePay Mobile is an Expo SDK 57 / React Native mobile client (mock-first, no real money logic). Standard commands live in `README.md` and `package.json` scripts; don't duplicate them here.

- Dependencies install with plain `npm install` (the update script). Web deps `react-dom`, `react-native-web`, and `@expo/metro-runtime` are declared, so no `--legacy-peer-deps` flag is needed.
- No mobile emulator is available in the cloud VM. Run/test the GUI via Expo Web: `npx expo start --web --port 8081` (Metro serves at `http://localhost:8081`). Native (Expo Go / simulators) is the intended runtime elsewhere; web is the practical target here.
- `expo-secure-store` has no web implementation. Session/token storage (`src/services/secureStorage.ts`, `src/api/sessionStorage.ts`) branches on `Platform.OS === 'web'` to use `localStorage`; native still uses SecureStore. Without this branch the web app crashes on load with `ExpoSecureStore.default.getValueWithKeyAsync is not a function`.
- Demo login (mock mode, the default): email `demo@securepay.app`, any 4–6 digit PIN, then "Continue in demo mode". Tabs: Home · SecureLinks · Create · Activity · Account.
- `expo start` may rewrite `tsconfig.json#include` (typed routes) at runtime; this is auto-generated and does not need committing.
- Staging mode and `smoke:staging-readonly` need developer-provided gateway URLs/tokens (never commit; never give secrets to cloud agents). Mock mode requires no secrets.
