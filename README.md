# Mock API

This Project is a mock server developed to facilitate frontend integration with the API while the API is being implemented. Since this mock API is of a prototype nature, it will become obsolete once the real API has been implemented.

## Environment Dependencies
Ensure that you have installed:
1. Node.js (v20.4 or later)
2. Docker (optional)

The project is developed with Node.js, while Docker is optionally used for containerizing the application and managing application services for smooth and consistent operation across any platform.

## Running the Mock Server Locally

To run the server on your local environment, please follow the steps mentioned below:

1. Configure the `.env` file according to the provided example file `.env.example`.
2. Install application dependencies:

   Run this command in your terminal:
   ```sh
   $ npm install
   ```

3. To start the server:

   Run this command in your terminal:
   ```sh
   $ npm start
   ```

The above steps will start the mock server on your local system.

## Running the Mock Server with Docker

If you prefer using Docker, the mock server can be run inside a Docker container:

Run this command in your terminal:
```sh
$ docker compose up -d
```

This command will build the Docker image of the mock server and run it. The `-d` flag is used for running the container in detached mode (running in the background).

## Documentation for API Endpoints

The documentation for the mock API is contained in `BeautyCare API V1.postman_collection.json`. This file can be imported into the Postman application. The documentation already contains example responses for each endpoint.

Please feel free to explore the collection to become familiar with the API endpoints.

**Note**: This mock server is just a prototype and is meant to be used until the real API is implemented. After that, this mock server will no longer be relevant.