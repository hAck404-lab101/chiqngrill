# Feature: Digital Menu

## Purpose

Create an app-like digital menu that helps customers browse Chiq-N-Grill meals, filter quickly, add items to cart, and move into checkout.

## User Flow

1. Customer opens `/menu`.
2. Customer searches by meal name, description, category, or badge.
3. Customer filters by category, price range, spice level, or availability.
4. Customer reviews item description, price, spice level, and prep time.
5. Customer taps **Add to Cart**.
6. Floating cart appears globally.
7. Customer opens `/order` to checkout through WhatsApp.

## Current MVP Behavior

- Menu data is stored in `lib/restaurant-data.ts`.
- Menu browsing is handled by `components/menu-browser.tsx`.
- Customers can search menu items.
- Customers can filter by category.
- Customers can filter by price range.
- Customers can filter by spice level.
- Customers can filter by availability.
- Customers can reset filters.
- Empty search/filter state is handled.
- Each meal card shows price, spice level, prep time, badge, and Add to Cart CTA.
- Cart uses local storage and checkout remains WhatsApp-based for MVP.

## Files Changed

- `lib/restaurant-data.ts`
- `components/section-heading.tsx`
- `components/cta-button.tsx`
- `components/add-to-cart-button.tsx`
- `components/menu-browser.tsx`
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

- No menu user input is stored on a server yet.
- Search/filter state is client-side only.
- Cart local storage is convenience data only and must not be trusted for final order totals.
- When backend is added, prices must be recalculated server-side.

## Testing Notes

- Check menu page loads.
- Check search works for names, descriptions, categories, and badges.
- Check category filter works.
- Check price filter works.
- Check spice filter works.
- Check availability checkbox works.
- Check reset filters works.
- Check empty state displays when no items match.
- Check Add to Cart works from filtered results.
- Check responsive layout.
- Check all prices and labels are correct.

## Known Issues

- Real food images are not yet added.
- Cart and checkout are local-only until backend is added.
- No admin menu editing yet.
