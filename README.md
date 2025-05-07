# Library Management System

A full-stack application for managing a library. It allows administrators to manage books, users, and borrowing operations. Readers can browse the catalog, check availability, and reserve books. The system supports authentication and role-based access.

### Tech Stack

* **Frontend:** React + TypeScript
* **Backend:** ASP.NET Core (C#)
* **Database:** MS SQL Server
* **ORM:** Entity Framework Core
* **Authentication:** ASP.NET Identity

### Getting Started

#### 1. Frontend (React)

```bash
cd client
npm install
npm run build
```

#### 2. Backend (ASP.NET Core)

```bash
cd server
dotnet restore
dotnet build
```

#### 3. Database Setup (EF Core & MSSQL)

```bash
cd server
dotnet ef database update
```

### Notes

* Update `appsettings.json` with your SQL Server connection string.
* SQL Server must be running before applying migrations.
