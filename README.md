# ZOMINO — Simplified Food Ordering Project

This repository contains a starter scaffold for the ZOMINO project described in `Plan.md`.
It provides:

- A backend skeleton using classic Spring MVC + Hibernate (JPA) with an in-memory H2 database for quick development.
- A frontend skeleton using React + MUI.

This scaffold focuses on being easy to run locally and extend. It intentionally keeps database wiring optional so you can switch to MySQL later.

Quick start (Windows cmd.exe):

1) Backend (Maven + embedded Tomcat via `spring-webmvc` setup)

- Build the backend (from project root):

  mvn -f "Backend/pom.xml" clean package

- To run a quick development server, you can run the provided `Main` class (if using an IDE) or deploy the generated WAR in a servlet container. This scaffold provides a small Java main runner that starts an embedded Jetty/Tomcat if you choose to add it.

2) Frontend (React)

- Install and start the frontend (from project root):

  cd "Frontend"
  npm install
  npm start

The frontend will try to fetch from `http://localhost:8080/api/` — see `Frontend/src/setupProxy.js` or change the backend port in `Backend/src/main/resources/application.properties`.

Notes & next steps
- Current backend uses an in-memory H2 DB by default for ease of development. To switch to MySQL, update `Backend/src/main/resources/application.properties` to use MySQL JDBC URL and credentials, and add the MySQL connector dependency in `Backend/pom.xml` (already present but commented/included).
- Controllers and services are minimal and return in-memory data to let you start the frontend quickly.
- Follow `Plan.md` to expand controllers, DAOs (Hibernate), and frontend pages.

If you want, I can:
- Wire up a full Hibernate DAO + MySQL profile.
- Add authentication scaffolding (JWT or session-based).
- Implement the full CRUD endpoints and React pages for restaurants, menu, cart and orders.


