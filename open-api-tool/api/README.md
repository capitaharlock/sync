 ## dev
 docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

## production
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