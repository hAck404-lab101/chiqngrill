# Admin Dashboard Plan

## Purpose

The admin dashboard should help the restaurant manage orders, menu items, customer requests, gallery content, and promotions.

## MVP Admin Sections

### 1. Dashboard Overview

Metrics:

- Today’s orders
- Pending orders
- Completed orders
- Estimated revenue
- Best-selling meals
- Reservation requests

### 2. Orders

Admin can:

- View new orders
- View order details
- Update order status
- Cancel order
- Contact customer
- Filter by status
- Filter by date

### 3. Menu Management

Admin can:

- Add menu item
- Edit menu item
- Delete or hide menu item
- Set price
- Add description
- Upload image
- Set category
- Set spice level
- Set availability
- Mark as popular or chef’s pick

### 4. Categories

Suggested categories:

- Chicken Combos
- Jollof Meals
- Herb Butter Rice Meals
- Fries & Sides
- Jerk Chicken
- Drinks
- Group Packs
- Special Offers

### 5. Gallery

Admin can:

- Upload food photos
- Upload interior photos
- Hide/show images
- Set featured images

### 6. Reviews

Admin can:

- View customer reviews
- Approve reviews
- Hide inappropriate reviews
- Feature strong reviews on homepage

### 7. Promos

Admin can create:

- Percentage discounts
- Fixed amount discounts
- Minimum order discounts
- Weekend deals
- Student discounts
- Free drink promos

### 8. Delivery Zones

Admin can manage:

- Zone name
- Delivery fee
- Estimated delivery time
- Availability

### 9. Settings

Admin can manage:

- Restaurant phone number
- WhatsApp number
- Opening hours
- Google Maps link
- Social media links
- Paystack public key/server config later

## Security Rules

- Admin routes must be protected.
- Admin role must be verified server-side.
- Menu price changes must be logged later.
- Payment status must not be editable without audit trail when payments are added.

## Future Admin Features

- Staff accounts
- Kitchen display
- Rider assignment
- Inventory alerts
- Sales reports
- Export orders to CSV
- Customer database
