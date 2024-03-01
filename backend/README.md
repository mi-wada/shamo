# Shamo 🐔 / README

## Local development

### Required tools

* [Docker](https://docs.docker.com)
* [Rust](https://www.rust-lang.org)
* [cargo-make](https://crates.io/crates/cargo-make)
* [cargo-watch](https://crates.io/crates/cargo-watch)
* [cargo-edit](https://crates.io/crates/cargo-edit)

### How to run?

```zsh
cargo make run
```

### How to run test?

```zsh
cargo make run-middleware
cargo make test
```

### How to auto format files?

```zsh
cargo fmt
```

### How to update all packages?

```zsh
cargo upgrade
```

### How to update specific package?

```zsh
cargo upgrade -p crate1
```
