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

IMAGES OF PRODUCTION :

<img width="1920" height="1080" alt="Screenshot 2025-12-18 034723" src="https://github.com/user-attachments/assets/81047619-f8fb-4572-85ae-8a37f47a2646" />
<img width="1920" height="1080" alt="Screenshot 2025-12-20 031513" src="https://github.com/user-attachments/assets/10611c0a-d34a-42e2-a0ea-be05595fad09" />
<img width="1804" height="867" alt="Screenshot 2025-12-20 035044" src="https://github.com/user-attachments/assets/03e98d83-0917-44d2-b3de-365e96a786d2" />
<img width="1812" height="939" alt="Screenshot 2025-12-20 035329" src="https://github.com/user-attachments/assets/ecaf1031-1afc-4711-9a0f-96be5e2f7832" />
<img width="1807" height="876" alt="Screenshot 2025-12-20 035346" src="https://github.com/user-attachments/assets/b472dde6-008c-4318-892d-1cf72bbc1d17" />
<img width="1808" height="938" alt="Screenshot 2025-12-20 035403" src="https://github.com/user-attachments/assets/70754df6-e070-4c43-ae65-023114343f0d" />
<img width="1803" height="947" alt="Screenshot 2025-12-20 035417" src="https://github.com/user-attachments/assets/a75b35ce-0061-4ac5-bdc4-ce85f563fa07" />
<img width="1798" height="875" alt="Screenshot 2025-12-20 035439" src="https://github.com/user-attachments/assets/667fe2db-8e0c-4d78-863c-2f3cdd1672ca" />
<img width="1807" height="863" alt="Screenshot 2025-12-20 035457" src="https://github.com/user-attachments/assets/b24079ba-085f-48d1-bf21-b67348b5395d" />

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
