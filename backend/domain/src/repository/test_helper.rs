use std::{env, str::FromStr};

use anyhow::Result;
use sqlx::{
    postgres::{PgConnectOptions, PgPool, PgPoolOptions},
    PgConnection,
};

use crate::{User, UserId};

use super::{room_repository, user_repository};

pub async fn get_tx() -> sqlx::Transaction<'static, sqlx::Postgres> {
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

pub async fn add_user(db_conn: &mut PgConnection, user: Option<User>) -> Result<User> {
    let user = user.unwrap_or(User {
        id: UserId::default(),
        name: "test".to_string(),
        icon_url: None,
    });

    user_repository::add(db_conn, &user).await?;

    Ok(user)
}

pub async fn add_room(
    db_conn: &mut PgConnection,
    room: Option<crate::Room>,
) -> Result<crate::Room> {
    let room = room.unwrap_or({
        let user = add_user(db_conn, None).await.unwrap();
        let room_id = crate::RoomId::default();

        crate::Room {
            id: room_id.clone(),
            name: "test".to_string(),
            emoji: "🍣".to_string(),
            created_by: user.id.clone(),
            members: vec![crate::room::Member {
                id: crate::room::MemberId::default(),
                room_id,
                user,
                total_amount: 0,
            }],
        }
    });

    crate::repository::room_repository::add(db_conn, &room).await?;

    Ok(room)
}
