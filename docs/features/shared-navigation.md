# Feature: Shared Navigation

## Purpose

Create a consistent navigation system across the Chiq-N-Grill web app so customer and operations pages feel connected and easier to maintain.

## Current MVP Behavior

- Shared header component exists at `components/app-header.tsx`.
- Customer pages use the default customer navigation.
- Operations pages use `variant="admin"`.
- Customer navigation links to menu, order, reservations, deals, tracking, gallery, and delivery.
- Operations navigation links to admin, kitchen, menu, and order views.
- Active route highlighting is implemented with `usePathname`.
- Mobile menu drawer is implemented with local component state.
- Mobile drawer includes page links plus quick cart/call or kitchen/admin CTAs.

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
- Add new global page links only in `components/app-header.tsx`.

## Testing Notes

- Check customer navigation links.
- Check operations navigation links.
- Check active route highlighting.
- Check mobile menu opens and closes.
- Check mobile drawer links navigate correctly.
- Check mobile header spacing.
- Check call and cart CTAs.
- Check header remains visible while scrolling.

## Known Issues

- Mobile drawer has no animation yet.
- Active route highlighting uses pathname only and does not handle query-specific states.
