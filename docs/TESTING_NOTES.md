# Testing Notes

## General Testing Rule

Every feature must be tested on desktop and mobile before merge.

## UI Testing

Check:

- Mobile layout
- Tablet layout
- Desktop layout
- Sticky header
- CTA buttons
- Food cards
- Dark background readability
- Image loading states
- Empty states
- Form validation messages

## Conversion Testing

Check:

- Order Now button works
- Call button works
- WhatsApp button opens correct message
- Directions button opens maps
- Menu CTA scrolls or navigates correctly
- Final CTA repeats the main actions

## Menu Testing

Check:

- Categories display correctly
- Prices display correctly
- Unavailable items cannot be ordered
- Spice levels display correctly
- Add-to-cart works
- Quantity update works
- Cart total updates

## Checkout Testing

Check:

- Empty cart cannot checkout
- Customer name is required
- Phone number is required
- Delivery address required for delivery
- Pickup does not require address
- Dine-in does not require address
- Order notes are optional
- Order reference is generated

## Admin Testing

Check:

- Admin routes are protected
- Admin can create menu item
- Admin can edit menu item
- Admin can hide menu item
- Admin can update order status
- Admin can approve reviews

## Security Testing

Check:

- No secrets in repo
- `.env` files ignored
- Form inputs validated
- API routes protected where needed
- CORS restricted when backend is added
- Rate limiting added to order/payment/auth endpoints

## Performance Testing

Check:

- Images are optimized
- Homepage loads quickly
- No unnecessary heavy animations
- Lighthouse score is acceptable
- Mobile ordering flow is smooth

## Accessibility Testing

Check:

- Buttons have accessible labels
- Color contrast is readable
- Forms have labels
- Keyboard navigation works
- Images have alt text
