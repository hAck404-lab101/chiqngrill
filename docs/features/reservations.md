# Feature: Reservations

## Purpose

Allow customers to request a table for dine-in, birthdays, casual visits, date nights, and group hangouts.

## Current MVP Behavior

- Reservation page exists at `/reservations`.
- Customer fills name, phone, date, time, guest count, occasion, and special request.
- Submission opens WhatsApp with a formatted reservation request.
- No backend storage or admin approval yet.

## Files Changed

- `app/reservations/page.tsx`
- `docs/features/reservations.md`

## Future Database/API Changes

- `reservations`
- `reservation_slots`
- `PATCH /api/admin/reservations/:id/status`

## Security Notes

- Validate all form input server-side when backend is added.
- Rate-limit reservation submissions.
- Do not expose customer phone numbers publicly.

## Testing Notes

- Check form fields.
- Check WhatsApp message formatting.
- Check mobile layout.
- Check date/time input behavior.
