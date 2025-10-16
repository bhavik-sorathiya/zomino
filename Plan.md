# 🍴 ZOMINO – Online Food Ordering & Delivery
### *(Simplified Zomato Clone for College Mini Project)*

**Frontend:** React + MUI  
**Backend:** SpringBoot (Core + MVC) + Hibernate + MySQL  
**Goal:** Functional, Clean, and Simple Fullstack Project demonstrating CRUD operations and integration.

---

## 🚀 ZOMINO – Real-World Simplified Fullstack Roadmap

---

### 🧩 PHASE 0 – Project Planning & Analysis

#### **Requirement Gathering**
Core MVP Features:
- User Login / Registration (custom logic)
- Browse Restaurants
- View Menus
- Add to Cart
- Place Orders
- View Order History
- Submit Reviews
- Restaurant Dashboard (for restaurant owners)
- Admin Panel (for managing restaurants and menus)

#### **Architecture Selection**
- **Frontend:** Modular React (Components + Pages + API Services)
- **Backend:** Classic 3-Layer Architecture
    - Controller → Service → DAO (Hibernate)
- No SpringBoot Boot, No Security Libraries (custom auth only)

#### **Tech Stack**
- ✅ React [using vite & only Javascript- no TypeScript & other things - means the vite project Framework is React & the variant is JavaScript + React Compiler ] + MUI
- ✅ SpringBoot (MVC + Core)
- ✅ Hibernate (ORM)
- ✅ MySQL Database
- ✅ REST APIs (manual configuration)

#### **Goal**
Build a **simple, understandable web app** showing CRUD operations, relational data handling, and frontend-backend communication.

#### **Documentation**
Prepare:
- Project Abstract
- Functional Document (User, Restaurant, Admin flows)
- ER Diagram & Data Flow Diagram (DFD)

---

### ⚙️ PHASE 1 – System Design (High-Level)

#### **1.1 Define Modules**

##### Frontend (React + MUI)
- `auth` – Login / Register (users & restaurants)
- `restaurants` – List & View restaurants
- `menu` – Show menu items per restaurant
- `cart` – Add / Remove items, Checkout
- `orders` – View order history & details
- `restaurant-dashboard` –
    - Manage Menu (CRUD)
    - View incoming Orders
- `admin` – Manage Restaurants & Users
- `common` – Navbar, Layout, Alerts

##### Backend (SpringBoot + Hibernate)
- `AuthController` – Handles login/register
- `UserController` – Manage user data
- `RestaurantController` – List & details of restaurants
- `MenuController` – CRUD for menu items
- `CartController` – Manage cart items
- `OrderController` – Place & view orders
- `ReviewController` – Manage reviews
- `AdminController` – Admin functionalities

---

#### **1.2 Database Design (ERD)**

| Entity | Fields (Key Columns) | Relationships |
|:--|:--|:--|
| **User** | id, name, email, password, role | 1–M Orders, 1–M Reviews |
| **Restaurant** | id, name, address, owner_id | 1–M MenuItem, 1–M Orders |
| **MenuItem** | id, restaurant_id, name, price, type | M–1 Restaurant |
| **Cart** | id, user_id | 1–M CartItem |
| **CartItem** | id, cart_id, menu_item_id, quantity | M–1 Cart |
| **Order** | id, user_id, restaurant_id, total_price, status | M–1 Restaurant, M–1 User |
| **OrderItem** | id, order_id, menu_item_id, qty, price | M–1 Order |
| **Review** | id, user_id, restaurant_id, rating, text | M–1 Restaurant |

---

### 🧮 PHASE 2 – Backend Development (SpringBoot + Hibernate)

#### **2.1 Folder Structure**

```
com.zomino
├── config
│ ├── HibernateUtil.java
│ └── DatabaseConfig.java
├── controller
├── service
├── dao
├── model
├── dto
└── util
```

#### **2.2 Implementation Flow**
**Controller → Service → DAO → Database (MySQL)**

- **DAO Layer:** Uses Hibernate sessions for CRUD  
- **Service Layer:** Contains logic (validation, total price calc, etc.)  
- **Controller Layer:** Exposes REST endpoints (@RequestMapping)

#### **2.3 Authentication (Simplified)**
- Custom Login & Registration using DAO queries  
- Basic password check (hashed or plaintext for demo)  
- Simple session or token handling on frontend (no SpringBoot Security)

#### **2.4 Example API Endpoints**

| Endpoint | Method | Description |
|:--|:--|:--|
| `/auth/register` | POST | Register user or restaurant |
| `/auth/login` | POST | Login and return user info |
| `/restaurants` | GET | Fetch all restaurants |
| `/restaurant/{id}/menu` | GET | Fetch menu items |
| `/menu/add` | POST | Add menu item (restaurant) |
| `/cart/add` | POST | Add to cart |
| `/order/place` | POST | Place order |
| `/order/{id}` | GET | View specific order |
| `/review/add` | POST | Add review |

---

### 🎨 PHASE 3 – Frontend Development (React + MUI)

#### **3.1 Folder Structure**
```aiexclude
src/
├── components/
│ ├── Navbar.jsx
│ ├── RestaurantCard.jsx
│ ├── MenuCard.jsx
│ ├── CartItem.jsx
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Restaurants.jsx
│ ├── Menu.jsx
│ ├── Cart.jsx
│ ├── Orders.jsx
│ ├── RestaurantDashboard.jsx
│ ├── AdminPanel.jsx
├── services/
│ ├── api.js
│ ├── restaurantService.js
│ ├── menuService.js
│ ├── orderService.js
├── App.jsx
└── index.jsx
```


#### **3.2 Key Features**
- **React Router** for page navigation
- **Axios** for API calls
- **MUI Components** for styling
- **Local/Context State** for app-wide data
- **Simple Validation** on forms

---

### 🧪 PHASE 4 – Testing & Validation

#### **Backend Testing**
- Test CRUD operations with dummy data in Postman
- Validate entity relationships in MySQL

#### **Frontend Testing**
- Manual testing of flows:
    - Register → Login → Browse → Add to Cart → Place Order
    - Restaurant → Add Menu → View Orders

---

### 🧰 PHASE 5 – Project Packaging

- **Documentation:** ERD, DFD, Screenshots, and Architecture Diagram
- **Database:** Export MySQL dump (`zomino_db.sql`)
- **Frontend Build:** `npm run build`
- **Backend Deployment:** Host on Tomcat or Jetty

---

### 🚀 PHASE 6 – Future Improvements (Optional)
- Real-time Order Updates (AJAX polling)
- Email confirmations for placed orders
- Basic Delivery Tracking
- Admin Reports (total orders, users, revenue)

---

### ✅ SUMMARY

| Layer | Technology                     |
|:--|:-------------------------------|
| **Frontend** | React + MUI                    |
| **Backend** | SpringBoot (Core + MVC)        |
| **ORM** | Hibernate                      |
| **Database** | MySQL                          |
| **Auth** | Custom login/register          |
| **Testing** | Manual                         |
| **Deployment** | Apache Tomcat [localhost only] |

---

### 🎓 Final Goal
> Deliver a clean, fully functional **ZOMINO – Online Food Ordering & Delivery** web application built with  
> React, SpringBoot, Hibernate, and MySQL that demonstrates end-to-end CRUD operations  
> and role-based functionality for **Users, Restaurants, and Admins**.

---
