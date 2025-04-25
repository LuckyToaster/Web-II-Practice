# Web Development II Practice

## Aim
In this project, we want to demonstrate that we can build a simple API with a codebase that is both **flexible** and **extensible**.

---

## Building And Running
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
4. `npm ci` to install dependencies using the `package-lock.json`
5. `npm start` to start the project

---

## MVC and Clean Code Architecture
We have learnt about different code organization approaches, mainly **MVC** and **Clean Architecture**. 

### The MVC model:
- Provides a simple separation of concerns
- Distinguishes between 3 parts:
    - **Model**, aka persistence or DB
    - **View** aka Frontend, API or public interface
    - **Controller**, business logic or code that connects the previous two

### Clean Code Architecture:
- Encompases more than MVC, it is like a superset of it.
- Divides the project into more components
- It is focused on separating the **business logic code** from the **infrastructure code**

As you can see, each code organization philosophy has its own set of terminology, but often these terms can be used interchangeably.

---

## Our Philosophy
For making a simple API, we found the Clean Code approach to be too complex and cumbersome.

We believe that we can make an application that is both flexible and extensible with a simple approach that is a blend of MVC and clean architecture

### We see our Server consisting of **4 layers**:
1. **DAOs (Data Access Objects)** ⇒ Our persistence layer, responsible of DB operations
2. **Entities Objects/Classes** ⇒ Passed to-and-from the DAOs, responsible for sanitising data passed to DAO and containing business methods.
3. **Use Cases** ⇒ Use the daos and the entities to perform our logic to be sent to the routes
4. **Routes** ⇒ Our API endpoints

### What each layer **knows**:
- **DAOs** know about the DB table schema and doing queries on that table
- **Entities** know about their corresponding DAO's schema
- **Use Cases** know about the DAO and entities' **interface** (their methods), but they do not know or care about their implementation
- **Routes** kow about the existence of their corresponding use case, and whether it returns data or not.

### Commonalities with the MVC and Clean Code Architectures:
- The Entities and Use Cases are responsible of **business logic**
- The DAOs and Routes are more closely tied with the **infrastructure** of the project
- The entities and use cases can be thought of as the Controller in MVC

### Pros:
- Allows extending the project with ease, by adding the necessary _DAOs_, _Entities_, _Use Cases_ and _Routes_ as the project grows
- Allows to change our Infrastructure with ease:
    - In the case of the Server: New Routes just need to call their corresponding use cases
    - In the case of the DB layer: DAOs just need to provide the same usage interface

### Cons:
- The DAOs and Entities are coupled:
    - Entities know about the DAOs table schema to sanitize input
    - Changing the DB implies re-writing the DAOs and editing the entities slightly
    - 
