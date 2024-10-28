# API Engine

API engine built with Go, to manage token receviables and use/synchronize Hyperledger Besu and Solana, and serve the 3 related frontends to Buyers, Suppliers and investors.

## Prerequisites

- Go 1.16 or later
- PostgreSQL

## Setup

1. Clone the repository:
   ```
   git clone hgit@ssh.dev.azure.com:v3/crypto-rewards/crypto-bridgerton/cb-api
   cd api-engine
   ```

2. Install dependencies:
   ```
   make deps
   ```
   or
   ```
   go mod download
   ```

3. Set up your environment variables:
   ```
   export DATABASE_URL="postgres://username:password@localhost:5432/dbname?sslmode=disable"
   export SERVER_ADDRESS=":8080"
   export BESU_URL="http://besu-node-url"
   export SOLANA_URL="http://solana-node-url"
   ```

   Adjust the values according to your setup.

## Running the application

To build and run the application:

```
make run
```

Or to just build:

```
make build
```

Then run the binary:

```
./api-engine
```

## Running tests

```
make test
```

## Cleaning up

To remove the binary and clean the project:

```
make clean
```

## Project Structure

- `main.go`: Entry point of the application
- `api/`: Contains API route handlers
- `config/`: Configuration loading and management
- `database/`: Database connection and operations
- `listeners/`: Blockchain event listeners
- `models/`: Data models
- `notifications/`: Notification management (fronend/email/sms/push)
- `queue/`: Queue implementation for action processing

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the PWC organization