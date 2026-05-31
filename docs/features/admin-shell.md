# Feature: Admin Dashboard Shell

## Purpose

Create the first operations-side structure for Chiq-N-Grill so future menu, order, promo, gallery, and settings management can be built cleanly.

## User Flow

1. Admin opens `/admin`.
2. Admin views key business metrics.
3. Admin sees recent order states.
4. Admin sees management areas for menu, orders, promos, gallery, reviews, and settings.

## Current MVP Behavior

- Static admin dashboard shell.
- No login/auth yet.
- No database reads yet.
- Uses placeholder operational metrics.

## Files Changed

- `app/admin/page.tsx`
- `docs/features/admin-shell.md`

## Database/API Changes

None yet.

Future backend tables:

- `admins`
- `orders`
- `menu_items`
- `promos`
- `gallery_images`
- `reviews`
- `settings`

## Security Notes

- This route must be protected before production.
- Do not deploy admin dashboard publicly without authentication.
- Admin role must be verified server-side once auth is added.
- Avoid exposing customer data until proper permissions exist.

## Testing Notes

- Check admin page loads.
- Check responsive cards.
- Check all management sections are visible.
- Confirm no sensitive real data is hardcoded.

## Known Issues

- No authentication yet.
- No backend yet.
- Metrics are placeholder values.
