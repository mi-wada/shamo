use std::{env, str::FromStr};

use domain::User;
use sqlx::{
    postgres::{PgConnectOptions, PgPool, PgPoolOptions},
    PgConnection,
};

use crate::user_repository;

pub(crate) async fn get_tx() -> sqlx::Transaction<'static, sqlx::Postgres> {
    let pool = get_pool().await;
    pool.begin().await.unwrap()
}

async fn get_pool() -> PgPool {
    dotenvy::from_filename(".env.test").expect("Failed to load .env.test");

    let connect_options = PgConnectOptions::new()
        .host(&env::var("PGHOST").unwrap())
        .port(env::var("PGPORT").unwrap().parse::<u16>().unwrap())
        .database(&env::var("PGDATABASE").unwrap())
        .username(&env::var("PGUSER").unwrap())
        .ssl_mode(sqlx::postgres::PgSslMode::from_str(&env::var("PGSSLMODE").unwrap()).unwrap());

    PgPoolOptions::new()
        .max_connections(1)
        .connect_with(connect_options)
        .await
        .expect("Can't connect to DB")
}
