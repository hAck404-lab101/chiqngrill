# Feature: Order Tracking

## Purpose

Create a realistic order tracking experience for Chiq-N-Grill so customers can understand where their meal is in the process after checkout.

## User Flow

1. Customer places an order through WhatsApp or future backend checkout.
2. Customer opens `/track`.
3. Customer enters an order reference.
4. Customer clicks **Track Order**.
5. Customer sees a clear status card and timeline of order progress.
6. Customer can call the restaurant or return to checkout/menu.

## Current MVP Behavior

- Interactive client-side tracking preview.
- No backend lookup yet.
- Uses a default sample order reference.
- Allows user to enter a reference and update the visible tracking card.
- Shows estimated ready time placeholder.
- Shows a timeline with completed, active, and pending states.
- Includes CTA to call restaurant.

## Files Changed

- `app/track/page.tsx`
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
- Avoid revealing too much information for random order references.

## Testing Notes

- Confirm tracking page loads.
- Confirm order reference input accepts text.
- Confirm Track Order updates the visible reference.
- Confirm status timeline renders.
- Confirm call CTA works.
- Confirm checkout/menu navigation works.
- Confirm mobile layout is readable.

## Known Issues

- No live backend status yet.
- No real order reference lookup yet.
- No SMS/WhatsApp status notifications yet.
