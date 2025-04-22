## 🪆 Project Organization
- **DAO** (Data Access Object) - Each file in `dao` directory contains a class that represents a table in the DB and has access to it
- **VO** (Value Object) - Business logic goes here, each file in `vo` contains a class that is passed to the DAO objects to do CRUD operations on the DB
- **web** - Contains anything related to the website, front and backend
    - **public** - Contains the static site that is served by the express server
    - **server** - Contains the Server logic (express)
        - **routes** - Defines API routes for each DAO and VO

If we had 5 tables in the DB, we'd have a DAO, a VO, and a route for each table. So we'd have 5 files in the `dao` directory, 5 files in the `vo` directory and 5 files in the `routes` directory.

--- 

## 🤔 Why we do this?
Because it allows our code to be neatly organized, and keeps the **business logic** separate from the **infrastructure logic** (the server/API and the persistence/DB).

#### There are 3 types of logic we want to keep separate:
- **1)** Business
- Infrastructure
    - **2)** web / server / API
    - **3)** persistence / data / DB

And organizing the code in this way not only allows us to that, it also allows us to extend to the project with ease, by adding the necessary DAOs, VOs and Routes as the project grows.
Thus, not only are separating our concerns and **de-coupling** our cude, we are also making it **flexible** and **extensible**

--- 

## 🏗️ Building
1. `git clone` this project
2. Install and set up a MariaDB database (Open source fork of MySQL): 
```bash
apt install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation # this is for security but it can be skipped
sudo mysql -u root -p # log into mysql
```
(must be logged in as root, in my case mysql -u root -p didnt work,
but i tried su, then `mysql -u root`  and ... it worked in sudo mode

```sql
CREATE DATABASE practice;
CREATE USER 'dev'@'%' IDENTIFIED BY 'dev';
GRANT ALL PRIVILEGES ON practice.* TO 'dev'@'%';
FLUSH PRIVILEGES;
EXIT;
```
3. After this you might want to update the environtment variables in the `.env` file to match your DB credentials
4. `npm install` to download dependencies **ACTUALLY USE NPM CI** to use the package-lock.json (no unexpected behaviour)
5. `npm start` to start the project

