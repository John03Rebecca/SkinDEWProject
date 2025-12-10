# SkinDew – Sustainable Skincare eCommerce

SkinDew is a full-stack skincare eCommerce platform focused on **sustainably packaged products for the market**.  
Customers can browse a curated catalogue, filter and search items, manage a shopping cart, and place orders.  
Administrators can review sales history, manage customer accounts, and adjust inventory levels.

Video Demo: https://github.com/John03Rebecca/SkinDEWProject/blob/8f1d33401863f05b905a2d0fde4e3c4956419f0f/Video-demo.mp4

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Features](#features)
  - [User Features](#user-features)
  - [Admin Features](#admin-features)
- [Database Design](#database-design)
- [Running the Project Locally](#running-the-project-locally)
- [Deployment on Railway](#deployment-on-railway)
- [Project Report](#project-report)

---

## Technologies Used

### Frontend

- HTML  
- CSS  
- JavaScript  
- Bootstrap 5  
- Modified Aura template for layout and styling

### Backend

- Node.js (Express)  
- MySQL  
- REST-style API endpoints  
- Session-based authentication (Express sessions)  
- MVC architecture  
- DAO (Data Access Object) pattern for data persistence  

### Deployment

- Railway (Production)  
- Local Environment (Development)

---
text[for admin dashboard: Email: test@example.com; Password: password123]
## Live Demo

https://skindewproject-production.up.railway.app/

---

## Project Structure

```text
│   .env
│   .gitignore
│   docker-compose.yml
│   Dockerfile
│   dump.sql
│   dump_clean.sql
│   package-lock.json
│   package.json
│   server.js
│
├───config
│       db.js
│
├───controllers
│       adminController.js
│       authController.js
│       cartController.js
│       catalogController.js
│       checkoutController.js
│       profileController.js
│
├───daos
│       AddressDAO.js
│       AdminDAO.js
│       CartDAO.js
│       ItemDAO.js
│       OrderDAO.js
│       UserDAO.js
│
├───middleware
│       auth.js
│
├───node_modules
│       (standard Node dependencies)
│
├───public
│   │   _redirects
│   │
│   ├───CSS
│   │       admin.css
│   │       base.css
│   │       cart.css
│   │       checkout.css
│   │       index.css
│   │       login.css
│   │       product.css
│   │       profile.css
│   │       register.css
│   │       skindew-home.css
│   │
│   ├───icomoon
│   │       icomoon.css
│   │       Read Me.txt
│   │       selection.json
│   │       fonts (eot/svg/ttf/woff)
│   │
│   ├───images
│   │       (all product and banner images)
│   │
│   ├───JS
│   │       admin.js
│   │       api.js
│   │       auth-state.js
│   │       cart.js
│   │       catalog.js
│   │       checkout.js
│   │       index.js
│   │       login.js
│   │       product.js
│   │       profile.js
│   │       register.js
│   │       script.js
│   │
│   └───pages
│           admin.html
│           cart.html
│           checkout.html
│           index.html
│           login.html
│           product.html
│           profile.html
│           register.html
│
├───routes
│       adminRoutes.js
│       authRoutes.js
│       cartRoutes.js
│       catalogRoutes.js
│       checkoutRoutes.js
│       profileRoutes.js
│
├───services
│       paymentService.js
│
└───sql
        schema.sql
```
---

## Features

### User Features

Curated sustainable catalogue
Front page and catalogue focus on skincare products that use eco-friendly or low-waste packaging (glass, metal, refillable, etc.) – curated at the data/content level.

Browse & discovery
Browse items with images, prices, descriptions, and remaining inventory.

Filter and search
Filter and search products by category, brand, and keyword.

Sorting
Sort products by price (ascending/descending) and by name.

Product details
View full product details, including description and inventory level.

Shopping cart
Add items to cart from product pages
Update quantities or remove items
Cart total updates immediately when items change
Cart is retained while navigating back to continue shopping; works for both logged-in users and guests (session-based cart)

Checkout
Checkout as a guest or as a registered user
If not logged in, user is prompted to log in or create an account during checkout
If logged in, saved billing and shipping information are loaded but can be overridden with temporary details
Payment is simulated via a payment service; on success, an order is created, inventory is reduced, and the cart is cleared

Account & profile
Register (sign up) and log in
View and update profile information (name, address, etc.)
View past orders and purchase history

---

## Admin Features

Admin Authentication
Admins log in through a separate admin interface.
Admin checks use a flag on the user table (no separate admins table).

Sales History
View all sales orders
Filter sales by customer, product, or date
View order details including user, products, quantities, and total price

Customer Accounts
View customer profiles and their purchase history
Update customer information such as shipping address and basic profile fields

Inventory Management
View inventory of all products
Increase or decrease product quantities as needed
Ensure that only products that meet sustainable packaging criteria remain listed in the catalogue (handled by content / data curation)

---

## Database Design

SkinDew uses a relational MySQL database. Core tables include:

user – accounts (customers and admins via is_admin flag), login details, and link to default address
address – address information (street, province, country, postal code, phone)
item – skincare products with name, description, category, brand, price, quantity, and image URL
cart_item – items currently in carts, linked to either a user_id or a guest session_id
purchase_order – completed orders, with user, totals, and denormalized billing/shipping details
purchase_order_item – line items for each order (product, quantity, unit price)
payment_method – stored payment metadata for users (brand, last 4 digits, expiry)

All database operations are routed through DAO classes to keep controllers decoupled from raw SQL.
The full schema is defined in sql/schema.sql (and dump_clean.sql for data).

---

## Running the Project Locally

1. Clone the repository
git clone https://github.com/YourUsername/skinDew.git
cd skinDew

2. Install dependencies
npm install

3. Set up the database

Create a MySQL database (for example, railway or skindew).

Import the schema:

mysql -u your_user -p your_database < sql/schema.sql
# or use dump_clean.sql if you want sample data

Configure your .env file with the correct MySQL connection string/variables
(matching what config/db.js expects).

4. Start the server
npm run dev
# or
node server.js

5. Visit the app
http://localhost:8080

(Use whatever port is configured in server.js or via PORT in your .env.)

---

## Deployment on Railway

The application is deployed on Railway with:

A Node.js service for the Express backend and static frontend
A managed MySQL instance
Environment variables configured for database connection and session secrets

Pushing to the main branch of this repository triggers a redeploy on Railway.

---

## Project Report

https://github.com/John03Rebecca/SkinDEWProject/blob/e23fb91875f5b20df445dce69e04cd2a31981bb9/Merged-report.pdf

System architecture and MVC design
Database design and EER diagram
Class and sequence diagrams
API endpoints and major flows
Challenges and how they were resolved
Creative and sustainability-focused enhancements
