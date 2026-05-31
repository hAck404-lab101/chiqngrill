# Feature: Cart & Checkout

## Purpose

Add the first real web-app ordering layer for Chiq-N-Grill so customers can add meals from the menu, review their basket, choose fulfillment mode, and submit through a WhatsApp fallback before backend storage is added.

## User Flow

1. Customer opens `/menu`.
2. Customer taps **Add to Cart** on one or more menu items.
3. Cart items are saved in browser local storage.
4. A floating cart indicator appears globally when cart has items.
5. Customer taps the floating cart or opens `/order`.
6. Customer reviews selected items in the order basket.
7. Customer increases, decreases, removes, or clears items.
8. Customer chooses order mode: dine-in, pickup, kerbside pickup, or delivery.
9. Customer enters name, phone, optional notes, and delivery address when needed.
10. Customer sees subtotal and estimated service/delivery notes.
11. Customer taps WhatsApp checkout.
12. WhatsApp opens with a formatted order summary.

## Current MVP Behavior

- Cart uses browser local storage through `lib/cart.ts`.
- Menu cards use `components/add-to-cart-button.tsx`.
- A global floating cart indicator is rendered from `app/layout.tsx`.
- The floating cart shows item count and subtotal.
- The `/order` page reads the live cart instead of a sample basket.
- Customers can update quantities.
- Quantity set below 1 removes the item.
- Customers can clear the whole cart.
- Submission goes through WhatsApp only.

## Files Changed

- `lib/cart.ts`
- `components/add-to-cart-button.tsx`
- `components/floating-cart.tsx`
- `app/layout.tsx`
- `app/menu/page.tsx`
- `app/order/page.tsx`
- `docs/features/cart-checkout.md`

## Database/API Changes

None yet.

Future backend tables:

- `orders`
- `order_items`
- `customers`
- `delivery_zones`
- `payments`

## Security Notes

- Current MVP does not store customer data on a server.
- Local storage cart data is for convenience only, not trusted business data.
- When backend is added, validate all form fields server-side.
- Do not trust frontend totals.
- Recalculate prices server-side before payment.
- Rate-limit order creation endpoints.

## Testing Notes

- Confirm menu page loads.
- Confirm Add to Cart writes item to local cart.
- Confirm floating cart appears after adding item.
- Confirm floating cart shows correct item count and subtotal.
- Confirm floating cart links to `/order`.
- Confirm `/order` shows added items.
- Confirm quantity increase works.
- Confirm quantity decrease works.
- Confirm item removes when quantity reaches 0.
- Confirm clear cart works.
- Confirm empty cart state works.
- Confirm order modes display correctly.
- Confirm WhatsApp message contains customer details, order mode, items, and total.
- Confirm delivery mode asks for address.
- Confirm mobile layout is usable.

## Known Issues

- Cart persists only in the same browser/device.
- No backend order storage yet.
- No Paystack payment yet.
- No real-time order tracking yet.
