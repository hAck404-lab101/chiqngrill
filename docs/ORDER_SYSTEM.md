# Order System Plan

## Purpose

The order system should make Chiq-N-Grill feel like a restaurant web app, not just a landing page.

## Customer Order Flow

1. Customer browses menu.
2. Customer adds meals to cart.
3. Customer adjusts quantity and add-ons.
4. Customer selects order type.
5. Customer enters contact details.
6. Customer confirms order.
7. App generates order reference.
8. Customer receives confirmation through on-screen message and later WhatsApp/SMS/email.

## Order Types

- Dine-in
- Pickup
- Kerbside pickup
- Delivery

## Required Customer Fields

- Full name
- Phone number
- Order type
- Delivery address if delivery is selected
- Order notes

## Order Statuses

- Pending
- Accepted
- Preparing
- Ready for pickup
- Out for delivery
- Completed
- Cancelled

## Order Reference Format

Suggested format:

`CNG-YYYYMMDD-0001`

Example:

`CNG-20260531-0001`

## Cart Rules

- Prices must be calculated server-side when backend is added.
- Frontend totals are for display only.
- Quantity must be at least 1.
- Unavailable menu items cannot be ordered.
- Delivery address is required for delivery orders.

## WhatsApp Fallback

Until full backend order processing is added, the checkout can generate a pre-filled WhatsApp message containing:

- Customer name
- Phone number
- Order type
- Meal list
- Quantities
- Estimated total
- Delivery address when applicable
- Notes

## Future Payment Flow

When Paystack is added:

1. Customer submits order.
2. Server creates pending order.
3. Server initializes Paystack transaction.
4. Customer pays.
5. Server verifies payment.
6. Order is marked as paid.
7. Admin receives new order alert.

## Admin Order Actions

- Accept order
- Reject/cancel order
- Mark as preparing
- Mark as ready
- Mark as out for delivery
- Mark as completed

## Testing Notes

Test all order types:

- Dine-in without delivery address
- Pickup without delivery address
- Delivery with address
- Delivery without address should fail
- Quantity update
- Remove item
- Empty cart checkout prevention
- WhatsApp message formatting
