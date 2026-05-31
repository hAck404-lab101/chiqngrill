# Feature: Cart & Checkout

## Purpose

Add the first real web-app ordering layer for Chiq-N-Grill so customers can review a sample order, choose fulfillment mode, and submit through a WhatsApp fallback before backend storage is added.

## User Flow

1. Customer opens `/order`.
2. Customer reviews selected items in the order basket.
3. Customer chooses order mode: dine-in, pickup, kerbside pickup, or delivery.
4. Customer enters name, phone, optional notes, and delivery address when needed.
5. Customer sees subtotal and estimated service/delivery notes.
6. Customer taps WhatsApp checkout.
7. WhatsApp opens with a formatted order summary.

## Current MVP Behavior

- Cart is a guided static MVP, not persistent yet.
- The initial basket uses selected menu items from `lib/restaurant-data.ts`.
- The checkout form uses client-side state.
- Submission goes through WhatsApp only.

## Files Changed

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

- Current MVP does not store customer data.
- When backend is added, validate all form fields server-side.
- Do not trust frontend totals.
- Recalculate prices server-side before payment.
- Rate-limit order creation endpoints.

## Testing Notes

- Confirm order page loads.
- Confirm order modes display correctly.
- Confirm WhatsApp message contains customer details, order mode, items, and total.
- Confirm delivery mode asks for address.
- Confirm mobile layout is usable.

## Known Issues

- Cart is not persistent yet.
- No backend order storage yet.
- No Paystack payment yet.
- No real-time order tracking yet.
