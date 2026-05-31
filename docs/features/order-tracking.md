# Feature: Order Tracking

## Purpose

Create a realistic order tracking experience for Chiq-N-Grill so customers can understand where their meal is in the process after checkout.

## User Flow

1. Customer places an order through WhatsApp or future backend checkout.
2. Customer opens `/track`.
3. Customer enters or views an order reference.
4. Customer sees a clear timeline of order progress.
5. Customer can call the restaurant or return to the menu.

## Current MVP Behavior

- Static tracking UI.
- No backend lookup yet.
- Uses a sample order reference.
- Shows a timeline with completed, active, and pending states.
- Includes CTA to call restaurant.

## Files Changed

- `app/track/page.tsx`
- `app/order/page.tsx`
- `docs/features/order-tracking.md`

## Database/API Changes

None yet.

Future backend tables:

- `orders`
- `order_status_events`

Future API routes:

- `GET /api/orders/:reference`
- `PATCH /api/admin/orders/:id/status`

## Status Model

Suggested order statuses:

- Pending
- Accepted
- Preparing
- Ready for pickup
- Out for delivery
- Completed
- Cancelled

## Security Notes

- Do not expose private customer data on public tracking pages.
- Public tracking should use order reference plus phone verification when backend is added.
- Admin status updates must require authentication.
- Rate-limit tracking lookup requests.

## Testing Notes

- Confirm tracking page loads.
- Confirm status timeline renders.
- Confirm call CTA works.
- Confirm menu CTA works.
- Confirm mobile layout is readable.

## Known Issues

- No live backend status yet.
- No real order reference lookup yet.
- No SMS/WhatsApp status notifications yet.
