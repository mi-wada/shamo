# syntax=docker/dockerfile:1

FROM rust:1.72.0 AS builder

WORKDIR /app

# Install and build crates first to increase the layer cache hit rate.
COPY ./Cargo.toml ./Cargo.lock ./
COPY ./infra/Cargo.toml ./infra/Cargo.toml
COPY ./domain/Cargo.toml ./domain/Cargo.toml
COPY ./handler/Cargo.toml ./handler/Cargo.toml
RUN mkdir src && echo 'fn main() {}' > src/main.rs && \
    mkdir ./infra/src && echo 'fn main() {}' > ./infra/src/lib.rs && \
    mkdir ./domain/src && echo 'fn main() {}' > ./domain/src/lib.rs && \
    mkdir ./handler/src && echo 'fn main() {}' > ./handler/src/lib.rs
ARG CARGO_HOME=/usr/local/cargo
# The cache of crates is stored in ${CARGO_HOME}/registry
# https://doc.rust-lang.org/cargo/guide/cargo-home.html#directories
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    cargo build --release
RUN rm -rf **/src

COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cargo build --release && \
    mv target/release/backend .

FROM debian:bookworm-slim

ARG ENV
ENV ENV=${ENV}

WORKDIR /app

COPY --from=builder /app/backend .
COPY --from=builder /app/.env.${ENV} .env.${ENV}

CMD ["./backend"]
