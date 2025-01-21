## *** dev

# Start DB in docker
docker-compose up -d
go run .\cmd\main.go --migrate
go run .\cmd\main.go --seed

# Run api
air -c air.toml

# Check
browse to http://localhost:8080/ and see if there is a response in console (cmd)



## *** production
docker-compose up -d

## Logs
docker-compose logs -f

## Execute DB migrations
./scripts/db.sh up      - Run migrations
./scripts/db.sh seed    - Seed reference data
./scripts/db.sh reset   - Reset database
./scripts/db.sh connect - Connect to database
./scripts/db.sh status  - Show migration status

## Test on Mac
brew install postgresql

## --- Deply instructions ---
## 1 build locally
go build -o api-server ./cmd/main.go
## 2 
## 3