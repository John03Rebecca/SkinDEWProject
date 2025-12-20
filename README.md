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
test[for admin dashboard: Email: test@example.com; Password: password123; https://skindewproject-production.up.railway.app/pages/login.html]
## Live Demo

https://skindewproject-production.up.railway.app/

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

#### Curated Sustainable Catalogue
Products emphasize eco-friendly and low-waste packaging (glass, metal, refillable).

#### Browse & Discovery
View product images, prices, descriptions, and live inventory levels.

#### Filter & Search
Filter products by category or brand and search by keyword.

#### Sorting
Sort products by price (ascending/descending) or by product name.

#### Product Details
View full product descriptions with inventory visibility.

#### Shopping Cart
- Add, update, or remove items
- Live cart total updates
- Session-based cart works for both guests and logged-in users

#### Checkout
- Guest or registered checkout
- Saved address autofill for logged-in users
- Simulated payment flow
- Order creation, inventory reduction, and cart clearing on success

#### Account & Profile
- Register and log in
- Update profile and address
- View order history

---

### Admin Features

#### Admin Authentication
Admins log in through a separate interface using an `is_admin` flag.

#### Sales History
- View all orders
- Filter sales by customer, product, or date
- Inspect detailed order breakdowns

#### Customer Management
- View customer profiles and purchase history
- Update customer information

#### Inventory Management
- Adjust product quantities
- Maintain sustainable-only catalogue entries

---

## Database Design

SkinDew uses a relational MySQL database. Core tables include:

- `user` – customers and admins (`is_admin` flag)
- `address` – billing and shipping addresses
- `item` – skincare products
- `cart_item` – active cart contents
- `purchase_order` – completed orders
- `purchase_order_item` – order line items
- `payment_method` – stored payment metadata

All database access is handled through DAO classes.  
The schema is defined in `sql/schema.sql` (with `dump_clean.sql` for clean data).

---

# Running the Project Locally (From Scratch)

This guide explains **exactly** how to run this project on a fresh laptop using Docker.
It assumes **no prior setup**, and it is written to avoid common pitfalls.

 **Important Context**
>
> * This project supports **local development via Docker**
> * **Railway (production) is completely separate**
> * Nothing you do locally will affect Railway

---

## What This Setup Does

When run locally, Docker will:

* Start a **MySQL database container**
* Automatically create tables and seed data using `schema.sql`
* Start the **Node.js backend**
* Connect the backend to the local MySQL database
* Expose the app on `http://localhost:3000`

---

## Run the Project Locally

## Prerequisites 
Before anything else, make sure you have:
1. **Docker Desktop**
   * Download: https://www.docker.com/products/docker-desktop
   * After installing, **open Docker Desktop and make sure it is running**
2. **Git**
   * Download: https://git-scm.com/downloads
3. **A terminal**
   * Windows: PowerShell
   * macOS/Linux: Terminal
     
**Project Structure**
These files are important for local setup:
Dockerfile # Builds the Node.js app
docker-compose.local.yml # Local Docker runtime config
sql/schema.sql # Local DB schema + seed data
> Do NOT rename these files unless you know what you’re doing.

## Step-by-Step: Run the Project Locally

**1️. Clone the repository**
```bash
git clone <REPO_URL>
cd <PROJECT_FOLDER>
```

**2. Make sure Docker Desktop is running**
Open Docker Desktop. Wait until it says “Docker is running”

**3. Start the local Docker environment**

Run this command:
```bash
docker compose -f docker-compose.local.yml up --build
```
What this does:
Builds the backend using the Dockerfile, starts MySQL, runs sql/schema.sql automatically (first time only)
It starts the app, and the first run may take a few minutes.

**5.Confirm the app is running**
In the terminal, you should eventually see something like:
Server running on port 3000
This means the backend is live.

**Open the application in your browser**
Go to:
<http://localhost:3000>
If products appear, everything worked.

**Database Behavior (Very Important)**
Database name: estore_db
Tables and sample data are created from: sql/schema.sql
MySQL data is stored in a Docker volume called: mysql_data

**Reset the database (if something goes wrong)**
If you want a clean reset:
```bash
docker compose -f docker-compose.local.yml down -v
docker compose -f docker-compose.local.yml up --build
```
This:
Deletes local DB data and re-runs schema.sql.

**6. If Something Fails**

Stop everything: Ctrl + C

Reset:
```bash
docker compose -f docker-compose.local.yml down -v
```
Restart:
```bash
docker compose -f docker-compose.local.yml up --build
```
Most issues are solved by a clean reset.

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
