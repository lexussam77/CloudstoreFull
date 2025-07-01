# CloudStore

A Dropbox-like cloud storage application with a React Native frontend and a Spring Boot backend.

---

## **Current Features & Stack**

### **Frontend**
- Built with React Native (Expo)
- Mobile-first, works with Expo Go
- Handles authentication, file/folder management, notifications, and more
- Connects to backend via REST API

### **Backend**
- Built with Spring Boot (Java 21)
- REST API for authentication, file/folder management, notifications, etc.
- JWT-based authentication
- Email notifications via Gmail SMTP
- File upload endpoint (preparing for cloud storage integration)

### **Database**
- **Provider:** [Neon](https://neon.tech/)
- **Type:** PostgreSQL
- **Connection:** Managed via JDBC in Spring Boot
- **Tables:** Users, Files, Folders, Notifications, etc. (auto-created by JPA)

### **Cloud Storage**
- **Current:** Preparing for integration (Amazon S3 recommended)
- **Next Steps:** Backend will upload files to S3 and store URLs in the database

### **API URLs**
- **Backend (local):** `http://<your-computer-ip>:8080/api` (for Expo Go)
- **Frontend:** Expo Go app, configured to use your local IP for backend API

### **Sites & Services Used**
- [Neon PostgreSQL](https://neon.tech/) — Free managed Postgres database
- [AWS S3](https://s3.console.aws.amazon.com/s3/home) — (Recommended for file storage)
- [Expo](https://expo.dev/) — For React Native development
- [Spring Boot](https://spring.io/projects/spring-boot) — Backend framework

---

## **Setup Summary**

### **Backend**
- Java 21, Spring Boot 3.2.5
- Connects to Neon PostgreSQL (see `src/main/resources/application.properties`)
- Email via Gmail SMTP
- Ready for S3 integration (see `pom.xml` for AWS SDK dependency)

### **Frontend**
- React Native (Expo)
- API base URL set to your local IP for mobile testing
- All API calls in `frontend/screens/api.js`

### **Database**
- Neon connection string in `application.properties`
- Tables auto-created by JPA entities

### **Cloud Storage**
- S3 integration planned (see README for setup steps)

---

## **How to Run Locally**

1. **Start Backend:**
   - `cd backend`
   - `mvn spring-boot:run` or use your Java run script
2. **Start Frontend:**
   - `cd frontend`
   - `npm install`
   - `npx expo start`
   - Use Expo Go on your phone, scan the QR code
3. **Make sure your phone and computer are on the same WiFi.**
4. **Update API base URL in `frontend/screens/api.js` to your computer's local IP.**

---

## **Credentials & Config**

- **Neon DB:**
  - Host: `ep-restless-paper-ab7uwvsx-pooler.eu-west-2.aws.neon.tech`
  - DB: `CloudStore`
  - User: `neondb_owner`
  - Password: (see `application.properties`)
- **Gmail SMTP:**
  - Username: `akombea77@gmail.com`
  - Password: (see `application.properties`)
- **S3:**
  - (To be added)

---

## **Next Steps**
- Integrate Amazon S3 for file uploads
- Deploy backend and frontend for public access
- Add more features as needed

---

## **Useful Links**
- [Neon Dashboard](https://console.neon.tech/)
- [AWS S3 Console](https://s3.console.aws.amazon.com/s3/home)
- [Expo Go](https://expo.dev/expo-go)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)

---

## **Contact**
For questions or help, contact: `akombea77@gmail.com` 