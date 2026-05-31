# Feature: Kitchen View

## Purpose

Prepare an operations screen for kitchen staff to move orders through the restaurant workflow.

## Current MVP Behavior

- Kitchen page exists at `/kitchen`.
- Static columns show New Orders, Preparing, and Ready.
- Move Forward buttons are visual placeholders.
- Route is not protected yet.

## Files Changed

- `app/kitchen/page.tsx`
- `docs/features/kitchen-view.md`

## Future Database/API Changes

- `orders`
- `order_status_events`
- `PATCH /api/admin/orders/:id/status`

## Security Notes

- Kitchen route must be protected before production.
- Only staff/admin users should update order states.
- Status updates should be logged.

## Testing Notes

- Check page loads.
- Check order lanes are readable.
- Check mobile layout.
- Check protected-route warning is visible.
