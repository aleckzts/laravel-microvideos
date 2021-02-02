# Development Stage

- Clone repository
```sh
git clone git@github.com:aleckzts/laravel-microvideos.git
```

- Enter the directory repository and build docker images
```sh
cd laravel-microvideos/
cp frontend/.env.example frontend/.env
docker-compose build
```

- Start the docker with application and backend
```sh
docker-compose up -d
```

- Access frontend application on port 3000
http://localhost:3000/
