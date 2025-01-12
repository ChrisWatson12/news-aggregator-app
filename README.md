# News Aggregator App

This project is a **news aggregator application** designed to fetch and display news articles from various sources. The application can be run either locally or within a Docker container.

## Getting Started

This guide provides step-by-step instructions on how to clone the repository and run the project both locally and in a Docker container.

---

## Prerequisites

Ensure the following tools are installed on your system:

1. **[Docker](https://docs.docker.com/get-docker/):** Required to build and run containers.
2. **Modern Web Browser:** Use a modern browser like Google Chrome or Firefox.

---

## Running the Project in Docker

### 1. Clone the Repository

Clone the project to your local machine using the following command:

```bash
git clone https://github.com/ChrisWatson12/news-aggregator-app.git
cd news-aggregator-app
```

---

### 2. Build the Docker Image

Build the Docker image for the project:

```bash
docker build -t news-aggregator-app .
```

- `-t news-aggregator-app`: Assigns the name `news-aggregator-app` to the image.

---

### 3. Run the Docker Container

Run the container using the built image:

```bash
docker run -d -p 3000:80 --name news-aggregator news-aggregator-app
```

- `-d`: Runs the container in detached mode.
- `-p 8000:8000`: Maps port 8000 on your machine to port 8000 inside the container.
- `--name news-aggregator`: Assigns the name `news-aggregator` to the container.
- `news-aggregator-app`: Specifies the image to run.

---

### 4. Access the Application

After running the container, you can access the application in your browser at:

```
http://localhost:8000
```

---

## Stopping the Container

To stop the container, use:

```bash
docker stop news-aggregator
```

To remove the container after stopping it:

```bash
docker rm news-aggregator
```

---

## Running the Project Locally

### 1. Clone the Repository

Clone the project to your local machine using the following command:

```bash
git clone https://github.com/ChrisWatson12/news-aggregator-app.git
cd news-aggregator-app
```

---

### 2. Install Dependencies

Ensure you have the required runtime environment installed (e.g., Node.js or Python). Then install the project dependencies:

```bash
npm install --legacy-peer-deps
```

---

### 3. Run the Application

Start the application using the relevant command:

```bash
npm start
```

---

### 5. Access the Application

Once the application is running, access it in your browser at:

```
http://localhost:8000
```

## Troubleshooting

1. **Port Conflicts:**
   If port `3000` is already in use, change the `-p` flag when running the container (e.g., `-p 8080:8000`).

2. **Rebuilding the Image:**
   If you make changes to the code, rebuild the image using:

   ```bash
   docker build --no-cache -t news-aggregator-app .
   ```

3. **Logs:**
   To view container logs:

   ```bash
   docker logs news-aggregator
   ```

---