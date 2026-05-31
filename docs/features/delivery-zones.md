# Feature: Delivery Zones

## Purpose

Prepare delivery area ranges, estimated delivery times, and fee rules before backend fee calculation is added.

## Current MVP Behavior

- Delivery page exists at `/delivery`.
- Static delivery zones show estimated fees and times.
- Customers can start a delivery order or call to confirm.

## Files Changed

- `app/delivery/page.tsx`
- `docs/features/delivery-zones.md`

## Future Database/API Changes

- `delivery_zones`
- `delivery_fee_rules`
- `GET /api/delivery-zones`

## Security Notes

- Delivery fees must be calculated server-side.
- Final order totals should come from trusted backend logic.
- Delivery details should be checked before accepting an order.

## Testing Notes

- Check page loads.
- Check zone cards.
- Check order/call CTAs.
- Check mobile layout.
