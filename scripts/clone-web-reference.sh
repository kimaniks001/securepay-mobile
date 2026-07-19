#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REF_DIR="${SECUREPAY_WEB_REF_DIR:-$ROOT_DIR/reference/securepaymain}"

PRIMARY_REPO="${SECUREPAY_WEB_REPO_URL:-https://github.com/kimaniks001/securepaymain.git}"
FALLBACK_REPO="https://github.com/kimaniks001/Ulyamwisho.git"

mkdir -p "$(dirname "$REF_DIR")"

clone_or_update() {
  local repo_url="$1"
  if [[ -d "$REF_DIR/.git" ]]; then
    echo "Updating existing web reference at $REF_DIR"
    git -C "$REF_DIR" fetch origin --depth 1
    git -C "$REF_DIR" checkout -B main origin/main 2>/dev/null || git -C "$REF_DIR" checkout -B master origin/master 2>/dev/null || true
    git -C "$REF_DIR" pull --ff-only origin main 2>/dev/null || git -C "$REF_DIR" pull --ff-only origin master 2>/dev/null || true
    return 0
  fi

  echo "Cloning $repo_url -> $REF_DIR"
  git clone --depth 1 "$repo_url" "$REF_DIR"
}

if [[ -d "$REF_DIR/.git" ]]; then
  clone_or_update "$PRIMARY_REPO"
  echo "Web reference ready: $REF_DIR"
  exit 0
fi

if clone_or_update "$PRIMARY_REPO" 2>/dev/null; then
  echo "Web reference ready: $REF_DIR"
  exit 0
fi

echo "Primary repo unavailable: $PRIMARY_REPO"
echo "Trying fallback: $FALLBACK_REPO"

if clone_or_update "$FALLBACK_REPO"; then
  echo "Web reference ready (fallback): $REF_DIR"
  exit 0
fi

cat <<EOF
Unable to clone SecurePay web frontend.

Create and push one of these repositories, then re-run:
  npm run sync:web-reference

Preferred:
  $PRIMARY_REPO

Fallback:
  $FALLBACK_REPO

Or set a custom URL:
  SECUREPAY_WEB_REPO_URL=https://github.com/<org>/<repo>.git npm run sync:web-reference
EOF
exit 1
