# Feature: Shared Navigation

## Purpose

Create a consistent navigation system across the Chiq-N-Grill web app so customer and operations pages feel connected and easier to maintain.

## Current MVP Behavior

- Shared header component exists at `components/app-header.tsx`.
- Customer pages use the default customer navigation.
- Operations pages use `variant="admin"`.
- Customer navigation links to menu, order, reservations, deals, tracking, and gallery.
- Operations navigation links to admin, kitchen, menu, and order views.

## Files Changed

- `components/app-header.tsx`
- `app/menu/page.tsx`
- `app/order/page.tsx`
- `app/track/page.tsx`
- `app/reservations/page.tsx`
- `app/deals/page.tsx`
- `app/delivery/page.tsx`
- `app/gallery/page.tsx`
- `app/admin/page.tsx`
- `app/kitchen/page.tsx`
- `docs/features/shared-navigation.md`

## Implementation Notes

- Use `<AppHeader />` for customer-facing pages.
- Use `<AppHeader variant="admin" />` for operations pages.
- Keep page-specific CTAs inside the page body.
- Keep shared links inside the header component.

## Testing Notes

- Check customer navigation links.
- Check operations navigation links.
- Check mobile header spacing.
- Check call and cart CTAs.
- Check header remains visible while scrolling.

## Known Issues

- Mobile menu drawer is not implemented yet.
- Active route highlighting is not implemented yet.
