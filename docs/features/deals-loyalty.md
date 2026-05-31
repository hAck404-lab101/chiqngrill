# Feature: Deals & Loyalty

## Purpose

Prepare promotional offers, loyalty points, birthday rewards, and referral incentives for customer retention.

## Current MVP Behavior

- Deals page exists at `/deals`.
- Static promo cards show future promo code concepts.
- Loyalty system is presented as Chiq Points.
- No backend validation yet.

## Files Changed

- `app/deals/page.tsx`
- `docs/features/deals-loyalty.md`

## Future Database/API Changes

- `promos`
- `loyalty_accounts`
- `loyalty_transactions`
- `referrals`

## Security Notes

- Promo codes must be validated server-side.
- Do not trust frontend discount calculations.
- Apply limits, expiry dates, and minimum order rules server-side.

## Testing Notes

- Check page loads.
- Check CTA links.
- Check mobile card layout.
