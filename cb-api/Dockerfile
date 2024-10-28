FROM golang:1.23-bookworm AS builder
WORKDIR /code

ADD . .


RUN make deps && make build
RUN chmod +rwx ./api-engine

FROM debian:bookworm-slim AS runner
WORKDIR /app

COPY --from=builder /code/api-engine /app

ENV SERVER_ADDRESS=:8080
EXPOSE 8080
CMD [ "./api-engine" ]