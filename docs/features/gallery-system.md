# Feature: Gallery & Brand Media

## Purpose

Create a visual-first gallery system for Chiq-N-Grill so the website feels like a real luxury restaurant brand instead of a template.

## User Flow

1. Visitor sees food and atmosphere visuals on the homepage.
2. Visitor opens `/gallery` for more food, interior, and customer vibe shots.
3. Visitor is pushed toward menu, call, WhatsApp, or directions.

## Current MVP Behavior

- Static gallery page.
- Placeholder visual cards are used until real restaurant images are available.
- Gallery is organized by brand mood: chicken, rice meals, sides, interior, drinks, and customer vibe.

## Files Changed

- `app/gallery/page.tsx`
- `docs/features/gallery-system.md`

## Database/API Changes

None yet.

Future backend tables:

- `gallery_images`
- `gallery_categories`

## Security Notes

When uploads are added:

- Validate file type.
- Limit file size.
- Store images in safe storage, not raw public upload folders.
- Restrict upload access to admins.
- Sanitize alt text and captions.

## Testing Notes

- Check gallery page loads.
- Check mobile masonry layout.
- Check CTA links.
- Replace placeholders with real images before launch.

## Known Issues

- Real food photos are required before client presentation.
- Upload management is not yet implemented.
