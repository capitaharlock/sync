FROM golang:1.23-alpine
WORKDIR /app

COPY go.mod ./
COPY go.sum ./
# code currently expects a .env file in the root directory
COPY .env ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal
COPY pkg ./pkg


RUN go build -o api-server ./cmd/main.go

EXPOSE 8080

CMD [ "./api-server" ]