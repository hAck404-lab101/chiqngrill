# Feature: Digital Menu

## Purpose

Create an app-like digital menu that helps customers browse Chiq-N-Grill meals and move quickly into ordering.

## User Flow

1. Customer opens `/menu`.
2. Customer selects a category.
3. Customer reviews item description, price, spice level, and prep time.
4. Customer taps an order CTA.
5. MVP sends customer to WhatsApp with a pre-filled order message.

## Current MVP Behavior

- Menu data is stored in `lib/restaurant-data.ts`.
- Menu page groups meals by category.
- Each meal card shows price, spice level, prep time, badge, and WhatsApp CTA.
- Ordering is not yet a full cart system.

## Files Changed

- `lib/restaurant-data.ts`
- `components/section-heading.tsx`
- `components/cta-button.tsx`
- `app/page.tsx`
- `app/menu/page.tsx`

## Database/API Changes

None yet. Data is static for MVP.

Future backend tables:

- `menu_categories`
- `menu_items`
- `menu_item_addons`
- `menu_item_images`

## Security Notes

- No user input is stored yet.
- WhatsApp ordering is client-side only for MVP.
- When backend is added, prices must be recalculated server-side.

## Testing Notes

- Check menu page loads.
- Check category links scroll correctly.
- Check WhatsApp CTA opens with the selected meal.
- Check responsive layout.
- Check all prices and labels are correct.

## Known Issues

- Real food images are not yet added.
- Search and filters are not yet added.
- Cart and checkout are not yet added.
