# Northcoders News API

This RESTful API serves data for a website similiar to Reddit. The project is built using [Node.js](https://nodejs.org) and [Express.js](http://expressjs.com/).

All the data is stored in a [PostgreSQL](https://www.postgresql.org/) database and the application interacts with it using [node-postgres](https://node-postgres.com/).

## Link to hosted version

https://be-nc-news-api.herokuapp.com/api/

## Instructions

### Requirements

    - Node v16.9.1
    - PostgreSQL psql 12.8

### Clone the repository

1- Open your terminal.

2- Change the current working directory to the location where you want the cloned directory.

3- Type the following command:

```
git clone https://github.com/ramonrodgal/nc-news
```

### Install dependencies

1- Open your terminal.

2- Change the current working directory into the location you previously cloned the repository

3- Type the following command:

```
npm install
```

### Environment variables

You need to create two .env files for this project: '.env.test' and '.env.development' to set the correct database name for that environment.

```
touch .env.test .env.development
```

In the .env.test file you need to add the following and save the file:

```
PGDATABASE=nc_news_test
```

In the .env.development file you need to add the following and save the file:

```
PGDATABASE=nc_news
```

Add both files into .gitignore writing the following inside the .gitignore file:

```
env.*
```

### Create the local database

The following script will run the 'setup.sql' file and will create the databases:

```
npm run setup-dbs
```

### Seed local database

You have been provided with a 'db' folder with some data to populate the databases.

To create the tables and insert the data into them you need to write following script in the terminal:

```
npm run seed
```

### Run tests

This project have been created using TDD (Test Driven Development) with [Jest](https://jestjs.io/) for unit testing and [Supertest](https://www.npmjs.com/package/supertest) for testing HTTP requests.

You can find all the test inside the **test** folder. To run all the tests type the following script in the terminal:

```
npm test
```

To make sure that every test will not be affected by others HTTPs request, the seed function will run before each test.

## Author

- [@ramonrodgal](https://github.com/ramonrodgal)
