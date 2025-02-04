# PharmaDirect

PharmaDirect is a comprehensive pharmacy management system that helps users find nearby pharmacies, check which ones are on duty, and manage pharmacy information. The system consists of three main components: a web application, a mobile application, and a backend server.

## Project Structure

The project is organized into the following directories:

- `web/`: # React + TypeScript web application.
- `pharmacyMobile/`: # React Native mobile application.
- `backend/`: # NestJS backend server.

## Features

- 🏥 Find nearby pharmacies
- 🕒 Check which pharmacies are on duty
- 📍 View pharmacy locations on a map
- ⭐ Save favorite pharmacies
- 🔍 Search for specific pharmacies
- 📱 Mobile-friendly interface
- 🌙 Dark mode support
- 🔐 User authentication
- 📨 Notification system for pharmacy duty changes

## Technologies Used

### Backend
- NestJS
- MongoDB with Mongoose
- TypeScript
- JWT Authentication
- Class Validator

### Web Application
- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vite
- React Router DOM
- Axios

### Mobile Application
- React Native
- Expo
- React Navigation
- AsyncStorage
- React Native Maps
- Expo Location

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CHERKAOUIfatimazahra/PharmaDirect.git
```

2. Navigate to the project directory:
```bash
cd pharmadirect
```

3. Install the dependencies:
```bash
npm install
```

4. Backend Setup:
```bash
cd backend
npm install
npm run start:dev
```

5. Web Setup:
```bash
cd web
npm install
npm run dev
```

6. Mobile Setup:
```bash
cd pharmacyMobile
npm install
npm run start
```

## Environment Variables

### Backend
Create a `.env` file in the backend directory:
```bash
touch .env
```

Add the necessary environment variables:
```bash
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Web
Create a `.env` file in the web directory:
```bash
touch .env
```

Add the necessary environment variables:
```bash
VITE_API_URL=http://localhost:3000
```
## API Documentation

The API documentation is available at `http://localhost:3000/api` when running the backend server in development mode.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- NestJS Team for the excellent backend framework
- React Team for the frontend framework
- Expo Team for the mobile development platform
- All contributors who have helped with the project

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline is configured for the backend service with the following stages:

### Backend Pipeline

1. **Testing Stage**
   - Runs on Ubuntu latest
   - Sets up Node.js 18
   - Installs dependencies
   - Runs unit tests
   - Performs ESLint checks

2. **Build and Push Stage**
   - Triggers after successful tests
   - Only runs on main branch pushes
   - Builds Docker image
   - Pushes to Docker Hub
   - Uses build cache for faster builds

3. **Deployment Stage**
   - Triggers after successful build
   - Only runs on main branch pushes
   - Deploys to production server via SSH
   - Updates Docker container

### Pipeline Triggers

The pipeline is triggered on:
- Push to main branch (affecting backend files)
- Pull requests to main branch (affecting backend files)

### Environment Requirements

The following secrets need to be configured in GitHub:
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token
- `DEPLOY_HOST`: Production server hostname
- `DEPLOY_USER`: SSH username
- `DEPLOY_KEY`: SSH private key


## Contact

Your Name - [fatimazahra-cherkaoui](https://www.linkedin.com/in/fatimazahra-cherkaoui/)
Project Link: [https://github.com/CHERKAOUIfatimazahra/PharmaDirect.git](https://github.com/CHERKAOUIfatimazahra/PharmaDirect)