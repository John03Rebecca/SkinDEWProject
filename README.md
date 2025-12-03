# SkinDew – Full-Stack eCommerce Application

SkinDew is a full-stack beauty eCommerce platform that allows users to browse products, filter by category, manage carts, and place orders. Administrators can manage inventory, view sales history, and maintain customer accounts.

This project was built as a final deliverable for the course.

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
- Modified Aura template

### Backend
- Node.js (Express)  
- MySQL  
- REST API architecture  
- JWT authentication  
- DAO pattern  

### Deployment
- Railway (Production)  
- Local Environment (Development)

---

## Live Demo

```
https://skindewproject-production.up.railway.app/
```

---

## Project Structure

```
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
│       paymentService.js
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
│           index.css
│           login.css
│           product.css
│           profile.css
│           register.css
│           skindew-home.css
│
│   ├───icomoon
│   │       icomoon.css
│   │       Read Me.txt
│   │       selection.json
│   │       fonts (eot/svg/ttf/woff)
│
│   ├───images
│   │       (all product and banner images)
│
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
│
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
- Browse products by category  
- Search, filter, and sort  
- Add to cart, update quantity, remove items  
- Checkout with order summary  
- User profile page  
- View order history  
- Secure login/signup with JWT

### Admin Features
- Admin Dashboard

#### Sales History
- View all sales  
- Filter by customer, product, or date  
- View order details (user, product, price, quantity)

#### Customer Accounts
- View customer profiles  
- View purchase history  
- Update customer info  

#### Inventory Management
- Modify inventory quantity for any product  

---

## Database Design

Collections used:
- users  
- items  
- carts  
- orders  
- addresses  
- admins  

The DAO pattern is used to separate database logic from route logic.

---
## Running the Project Locally

### 1. Clone the repository
```
git clone https://github.com/YourUsername/skinDew.git
cd skinDew
```

### 2. Install dependencies
```
npm install
```

### 3. Start the server
```
npm run dev
```

### 4. Visit the app
```
http://localhost:8080
```

## Project Report

A 10–15 page project report accompanies this repository.  
It includes:

- System architecture  
- Database design  
- Class diagrams  
- API documentation  
- Challenges and resolutions  
- Creative enhancements  

