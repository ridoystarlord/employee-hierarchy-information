## Installation

```bash
$ yarn install
```

## Rename the .env.example to .env and insert below values

```bash
DATABASE_URL=
PORT=
```

## Migrate

```bash
$ yarn run migrate
```

## Running the app Locally

```bash
# development
$ yarn run dev
```

## API Documentation

Once your application is running, access the API documentation at:

[API Docs](http://localhost:8000/api-docs)

## Running the app with docker & database (Please make sure you use the docker postgresql connection url in env)

```bash
$ docker compose up --build -d
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

# Deployment

## Install Nginx

```bash
$ sudo apt install nginx
```

## Clone the repository

```bash
$ git clone https://github.com/ridoystarlord/employee-hierarchy-information.git
$ cd employee-hierarchy-information
```

## Run the application

```bash
$ docker compose up --build -d
```

## create a new configuration file

```bash
$ sudo nano /etc/nginx/sites-available/nestjs-app
```

## insert below configuration

```bash
server {
    listen 80;
    server_name <your_domain>;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## create symbolic link

```bash
$ sudo ln -s /etc/nginx/sites-available/nestjs-app /etc/nginx/sites-enabled/
```

## check the configuration

```bash
$ sudo nginx -t
```

## reload the nginx configuration

```bash
$ sudo systemctl reload nginx
```

## Scaling

- Use Kubernetes for auto-scaling.
- Implement caching with Redis.
- Use load balancers to distribute traffic.

## Monitoring and Logging

- Use Prometheus and Grafana for monitoring.

```

```
