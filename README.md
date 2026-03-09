# Gharpayy Lead Management CRM MVP

## Overview
This is a custom-built Minimum Viable Product (MVP) for the Gharpayy Lead Management System. It captures leads, assigns ownership via a round-robin algorithm, manages a sales pipeline, and schedules visits.

## 1. System Architecture
The application uses a decoupled client-server architecture:
* **Frontend:** Built with React, TypeScript, and Tailwind CSS. It handles the UI, state management, and Kanban drag-and-drop interactions.
* **Backend:** A custom RESTful API built with Python and Flask to handle data routing and business logic.
* **Database:** SQLite managed via SQLAlchemy ORM for rapid, zero-configuration relational data storage.

## 2. Database Design
The relational database contains three core entities:
* **Agent Table:** `id`, `name`, `email`
* **Lead Table:** `id`, `name`, `phone`, `source`, `status`, `assigned_agent_id` (Foreign Key), `created_at`
* **Visit Table:** `id`, `lead_id` (Foreign Key), `property_name`, `visit_date`

## 3. Scalability for Production
To scale this MVP for production:
* **Database:** Migrate from SQLite to PostgreSQL to handle concurrent connections and larger datasets.
* **Async Processing:** Implement Redis and Celery to process incoming webhooks (e.g., from WhatsApp or Facebook) without slowing down the main API.
* **Hosting:** Containerize the application using Docker and deploy it on a cloud provider like AWS or GCP behind a load balancer.

## 4. Technical Expectations & Tools
* **Tools Used:** React, Vite, Tailwind, Lucide Icons, Python, Flask, SQLAlchemy, CORS.
* **Expectations for Full Build:** To build the production system, I will need access to the official WhatsApp Business API credentials, details on existing website form webhooks, and a staging environment for testing.
