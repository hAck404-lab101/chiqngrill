# Backend & Payment Plan

## Purpose

This document defines the safe backend direction before adding database, authentication, payments, and live order management.

## Recommended Backend Direction

Preferred stack:

- Next.js API routes or server actions
- Supabase PostgreSQL
- Supabase Auth or Clerk for admin auth
- Supabase Storage for menu/gallery images
- Paystack for Mobile Money/card payments
- Optional SMS/WhatsApp provider later

## Database Tables

### `menu_categories`

- `id`
- `name`
- `slug`
- `sort_order`
- `is_active`
- `created_at`

### `menu_items`

- `id`
- `category_id`
- `name`
- `slug`
- `description`
- `price`
- `spice_level`
- `prep_time`
- `badge`
- `image_url`
- `is_available`
- `is_featured`
- `created_at`
- `updated_at`

### `customers`

- `id`
- `full_name`
- `phone`
- `email`
- `created_at`

### `orders`

- `id`
- `order_reference`
- `customer_id`
- `order_mode`
- `status`
- `subtotal`
- `delivery_fee`
- `total`
- `delivery_address`
- `notes`
- `payment_status`
- `payment_reference`
- `created_at`
- `updated_at`

### `order_items`

- `id`
- `order_id`
- `menu_item_id`
- `item_name_snapshot`
- `unit_price_snapshot`
- `quantity`
- `line_total`
- `created_at`

### `promos`

- `id`
- `code`
- `discount_type`
- `discount_value`
- `minimum_order_amount`
- `usage_limit`
- `expires_at`
- `is_active`

### `gallery_images`

- `id`
- `title`
- `caption`
- `image_url`
- `category`
- `is_featured`
- `created_at`

### `settings`

- `id`
- `key`
- `value`
- `updated_at`

## API Routes

Suggested routes:

- `GET /api/menu`
- `POST /api/orders`
- `GET /api/orders/:reference`
- `PATCH /api/admin/orders/:id/status`
- `POST /api/payments/initialize`
- `POST /api/payments/verify`
- `GET /api/admin/dashboard`

## Payment Rules

- Create pending order before payment.
- Initialize Paystack server-side.
- Verify Paystack transaction server-side.
- Only mark order as paid after verification.
- Compare verified amount with server-calculated order total.
- Store payment reference.

## Security Requirements

- Enable Supabase RLS on all tables.
- Protect admin APIs.
- Rate-limit order and payment endpoints.
- Validate and sanitize all order inputs.
- Never trust frontend totals.
- Never expose service role keys to frontend.
- Keep all secrets in environment variables.

## Deployment Requirements

- Add `.env.example` only, never real `.env`.
- Configure production environment variables in Vercel.
- Test all order modes before launch.
- Test Paystack verification using test keys before live keys.
- Add rollback plan before launch.
