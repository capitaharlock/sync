# Makefile for API Engine

GO = go
BINARY_NAME = api-engine

.PHONY: build run test clean deps

build:
	$(GO) build -o $(BINARY_NAME) main.go

run: build
	./$(BINARY_NAME)

test:
	$(GO) test ./...

clean:
	rm -f $(BINARY_NAME)
	$(GO) clean

deps:
	$(GO) mod download