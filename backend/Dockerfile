# syntax=docker/dockerfile:1

FROM rust:1.72.0 AS build

WORKDIR /app

COPY ./Cargo.toml ./Cargo.lock ./
COPY ./infra/Cargo.toml ./infra/Cargo.toml
COPY ./domain/Cargo.toml ./domain/Cargo.toml
COPY ./handler/Cargo.toml ./handler/Cargo.toml
RUN mkdir src && echo 'fn main() {}' > src/main.rs && \
    mkdir ./infra/src && echo 'fn main() {}' > ./infra/src/lib.rs && \
    mkdir ./domain/src && echo 'fn main() {}' > ./domain/src/lib.rs && \
    mkdir ./handler/src && echo 'fn main() {}' > ./handler/src/lib.rs
ARG CARGO_HOME=/usr/local/cargo
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cargo build --release

COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cargo build --release && \
    mv target/release/backend .

FROM debian:bookworm-slim

ARG ENV
ENV ENV=${ENV}

WORKDIR /app

COPY --from=build /app/backend .
COPY --from=build /app/.env.${ENV} .env.${ENV}

CMD ["./backend"]
