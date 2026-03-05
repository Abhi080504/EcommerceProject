# Ecommerce Project

This repository contains the source code for the Ecommerce application, built with a React frontend and a Spring Boot backend.

## ⚠️ CRITICAL: CI/CD & Linux Compatibility

**BEFORE PUSHING ANY CODE, YOU MUST READ THIS SECTION.**

This project is deployed via a Linux-based CI/CD pipeline. Linux file systems are **case-sensitive**, whereas Windows (where most development happens) is not. This difference frequently causes build failures if filenames and imports do not match exactly.

### 1. Case Sensitivity Rules
*   **File Names**: Always use `PascalCase` for React components (e.g., `AddressCard.tsx`) and `camelCase` for utilities/hooks.
*   **Imports**: The capitalization in your `import` statement **MUST EXACTLY MATCH** the capitalization of the file on disk.
    *   ❌ BAD: `import AddressCard from './addresscard'` (if file is `AddressCard.tsx`)
    *   ✅ GOOD: `import AddressCard from './AddressCard'`

### 2. The `fix_imports.ps1` Script
A PowerShell script is included in the root directory to automatically detect and fix case-sensitivity mismatches in your imports.

**YOU MUST RUN THIS SCRIPT BEFORE EVERY PUSH.**

```powershell
./fix_imports.ps1
```

If this script detects changes, commit them! It means your code would have broken the build.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   Java Development Kit (JDK 17)
*   MySQL Server (v8.0)

### Database Setup
1.  **Create Database**:
    ```sql
    CREATE DATABASE myecommerce;
    ```
2.  **Import Schema & Data**:
    *   Use the `myecommerce_fixed.sql` file located in the root directory. **Do NOT use `myecommerce.sql`** as it contains casing issues that break on Linux MySQL servers (specifically `lower_case_table_names` issues).
    *   Command: `mysql -u root -p myecommerce < myecommerce_fixed.sql`

### Backend Setup
1.  Navigate to the `backend` directory.
2.  Update `src/main/resources/application.properties` if your local database credentials differ from the defaults:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/myecommerce
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend Setup
1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

---

## Deployment Standards
*   **Do not commit hardcoded secrets.** Use environment variables for API keys.
*   **Check `fix_imports.ps1` output.**
*   **Verify table names.** Ensure your local code queries tables with the exact casing defined in `myecommerce_fixed.sql`.

Happy Coding!
