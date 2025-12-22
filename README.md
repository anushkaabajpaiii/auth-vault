# auth-vault
🔐 AuthVault — Secure Authentication Platform

AuthVault is a production-grade authentication and session management platform designed to handle secure user authentication, authorization, and account security for modern web applications.
It demonstrates real-world backend engineering, cloud deployment, and DevOps practices.

🚀 Live Demo & Links

Swagger API Docs: http://<EC2-IP>:5000/api/docs

API Health Check: http://<EC2-IP>:5000/api/health

GitHub Repository: https://github.com/anushkaabajpaiii/auth-vault

🧠 Why AuthVault?

Most tutorial projects stop at basic login/signup.
AuthVault goes beyond textbook authentication and implements real-world security patterns used in production systems:

Short-lived access tokens + refresh token rotation

Session invalidation (logout all devices)

Brute-force protection via login attempt tracking

Account lockout and recovery flows

Cloud-native deployment with CI/CD

✨ Key Features
🔑 Authentication & Security

JWT-based authentication (Access + Refresh tokens)

Secure password hashing with bcrypt

Refresh token rotation and revocation

Logout from current session and all sessions

Role-Based Access Control (Admin/User)

🛡️ Account Protection

Login attempt tracking

Temporary account lockout after repeated failures

Password reset with expiring, hashed tokens

Protection against token reuse and brute-force attacks

📊 Observability & Admin Control

Login attempt history per user

Admin-only endpoints for monitoring authentication activity

Health check endpoint for uptime monitoring

🧱 Architecture Overview
┌────────────┐
│ Frontend   │  (Streamlit Dashboard)
└─────┬──────┘
      │ REST APIs
┌─────▼──────┐
│ AuthVault  │  (Node.js + Express)
│ Backend    │
└─────┬──────┘
      │
┌─────▼──────┐
│ MongoDB    │  (Atlas)
└────────────┘

CI/CD: GitHub Actions → Docker → AWS EC2

🛠️ Tech Stack
Backend

Node.js, Express.js

MongoDB Atlas (Mongoose ODM)

JWT (jsonwebtoken)

bcrypt (password hashing)

Frontend

Streamlit (Admin & User Dashboard)

DevOps & Cloud

Docker & Docker Compose

AWS EC2

GitHub Actions (CI/CD)

Swagger (OpenAPI Documentation)

📁 Project Structure
auth-vault/
├── src/
│   ├── config/          # Database & environment configs
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Auth & admin routes
│   ├── middleware/      # Auth, RBAC, error handling
│   └── utils/           # JWT & token helpers
├── index.js             # App entry point
├── swagger.js           # Swagger configuration
├── Dockerfile
├── docker-compose.yml
└── README.md

🔌 API Overview
Authentication

POST /api/auth/signup – Create new user

POST /api/auth/login – Login & issue tokens

POST /api/auth/refresh-token – Rotate tokens

POST /api/auth/logout – Logout current session

POST /api/auth/logout-all – Logout all sessions

Account Recovery

POST /api/auth/forgot-password

POST /api/auth/reset-password

Protected Routes

GET /api/auth/me

GET /api/auth/admin-only

Monitoring

GET /api/auth/login-attempts

GET /api/auth/admin/login-attempts

GET /api/health

🐳 Running Locally with Docker
git clone https://github.com/anushkaabajpaiii/auth-vault.git
cd auth-vault

docker compose up -d --build


Backend will be available at:

http://localhost:5000

☁️ Deployment & CI/CD

Dockerized backend deployed on AWS EC2

GitHub Actions automatically:

Pulls latest code on every push to main

Rebuilds Docker image

Restarts services using Docker Compose

Zero manual deployment steps required

<img width="1807" height="863" alt="Screenshot 2025-12-20 035457" src="https://github.com/user-attachments/assets/f80108a2-8108-46b4-b9e9-16e8979c500c" />


🔐 Security Considerations

Passwords are never stored in plain text

Refresh tokens are rotated and invalidated

Sensitive routes are protected via middleware

Environment variables used for secrets

Account lockout prevents brute-force attacks

📈 Future Enhancements

HTTPS with Nginx & Let’s Encrypt

Rate limiting & IP throttling

Centralized logging (ELK / CloudWatch)

Migration to ECS / Kubernetes

OAuth (Google/GitHub) login

👩‍💻 Author

Anushka Shree Bajpai
Computer Science & Engineering
Backend | Cloud | DevOps | AI/ML

GitHub: https://github.com/anushkaabajpaiii

LinkedIn: (add your LinkedIn profile here)

⭐ Final Note

AuthVault is built as a real-world backend system, not a demo project.
It reflects production practices, security awareness, and cloud deployment skills expected from a professional software engineer.

If you find this project useful, feel free to ⭐ the repository.
