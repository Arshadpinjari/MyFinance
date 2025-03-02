# MyFinance

MyFinance is a personal finance management system that helps users track their expenses, manage budgets, and monitor financial health.

## 🚀 Features
- User authentication and security using JWT.
- MongoDB-based database for storing financial data.
- Email notifications for account activities.
- Fully responsive frontend for better user experience.

## 🛠️ Tech Stack
- **Frontend:** React.js / Vue.js (as per implementation)
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **Styling:** TailwindCSS (if applicable)

## 📂 Project Structure
```
MyFinance/
│-- backend/    # Server-side code (Express, MongoDB)
│-- frontend/   # Client-side code (React/Vue)
│-- .env        # Environment variables (Not to be committed)
│-- .gitignore  # Ignored files in Git
│-- package.json
│-- README.md
```

## 🔧 Setup & Installation
### 1️⃣ Clone Repository
```sh
git clone https://github.com/Arshadpinjari/MyFinance.git
cd MyFinance
```

### 2️⃣ Install Dependencies
#### Backend
```sh
cd backend
npm install
```
#### Frontend
```sh
cd frontend
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following details:
```
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URI=<your-mongodb-uri>

# Security & Encryption
JWT_SECRET_KEY=<your-secret-key>
NODE_ENV=development
ENCRYPTION_SALT=10

# Email Configuration
SMTP_HOST=<your-smtp-host>
SMTP_PORT=465  
SMTP_SECURE=true
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>
SMTP_AUTH=true
FRONTEND_URL=http://localhost:3000
```
💡 **Note:** Never commit the `.env` file to Git. Use `.gitignore` to exclude it.

### 4️⃣ Run the Application
#### Start Backend Server
```sh
cd backend
npm start
```
#### Start Frontend
```sh
cd frontend
npm run dev
```

## 🚀 Deployment
For free deployment options:
- **Frontend:** Deploy on **Vercel** / **Netlify**
- **Backend:** Deploy on **Render** / **Railway.app** / **Fly.io**
- **Database:** Use **MongoDB Atlas** (Free Tier)

## ✨ Contributor

Thanks to this amazing contributor who helped build **MyFinance**! 🎉  

👤 **[Arshad Harun Pinjari](https://github.com/Arshadpinjari)**  

Want to contribute? Feel free to submit a pull request! 🚀
