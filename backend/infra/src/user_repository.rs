use domain::{User, UserId};
use sqlx::{PgConnection, PgPool, Row};

pub struct UserRepository;

impl UserRepository {
    pub async fn save(user: &User, conn: &mut PgConnection) {
        sqlx::query("INSERT INTO users (id, name, icon_url) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2, icon_url = $3")
            .bind(&user.id)
            .bind(&user.name)
            .bind(&user.icon_url)
            .execute(conn)
            .await
            .unwrap();
    }

    pub async fn get_by_id(id: UserId, conn: &mut PgConnection) -> Option<User> {
        let row = sqlx::query("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(conn)
            .await
            .unwrap();

        row.map(|row| User {
            id: row.get("id"),
            name: row.get("name"),
            icon_url: row.get("icon_url"),
        })
    }
}

#[cfg(test)]
mod tests {
    use std::{env, future::Future, pin::Pin, str::FromStr};

    use super::*;
    use domain::UserId;
    use sqlx::postgres::{PgConnectOptions, PgPoolOptions};

    async fn get_pool() -> PgPool {
        dotenvy::from_filename(".env.test").expect("Failed to load .env.test");

        let connect_options = PgConnectOptions::new()
            .host(&env::var("PGHOST").unwrap())
            .port(env::var("PGPORT").unwrap().parse::<u16>().unwrap())
            .database(&env::var("PGDATABASE").unwrap())
            .username(&env::var("PGUSER").unwrap())
            .password(&env::var("PGPASSWORD").unwrap())
            .ssl_mode(sqlx::postgres::PgSslMode::from_str(&env::var("PGSSLMODE").unwrap()).unwrap())
            .ssl_client_cert(env::var("PGSSLCERT").unwrap())
            .ssl_client_key(env::var("PGSSLKEY").unwrap())
            .ssl_root_cert(env::var("PGSSLROOTCERT").unwrap());

        PgPoolOptions::new()
            .max_connections(2)
            .connect_with(connect_options)
            .await
            .expect("Can't connect to DB")
    }

    // async fn with_transaction<F, Fut>(mut test_case: F)
    // where
    //     F: FnMut(sqlx::Transaction<'_, sqlx::Postgres>) -> Fut + Send,
    //     Fut: Future<Output = ()> + Send,
    // {
    //     let pool = get_pool().await;
    //     let tx = pool.begin().await.unwrap();

    //     test_case(tx).await;

    //     tx.rollback().await.unwrap();
    // }

    #[tokio::test]
    async fn test_ok_save_create() {
        // with_transaction(|tx| async {
        //     let user = User {
        //         id: UserId::new(),
        //         name: "test".to_string(),
        //         icon_url: Some("https://example.com".to_string()),
        //     };

        //     UserRepository::save(&user, &mut tx).await;

        //     let user = UserRepository::get_by_id(user.id, &mut tx).await.unwrap();

        //     assert_eq!(user.name, "test");
        //     assert_eq!(user.icon_url, Some("https://example.com".to_string()));
        // })
        // .await;

        let pool = get_pool().await;
        let mut tx = pool.begin().await.unwrap();

        let user = User {
            id: UserId::new(),
            name: "test".to_string(),
            icon_url: Some("https://example.com".to_string()),
        };

        UserRepository::save(&user, &mut tx).await;

        let user = UserRepository::get_by_id(user.id, &mut tx).await.unwrap();

        assert_eq!(user.name, "test");
        assert_eq!(user.icon_url, Some("https://example.com".to_string()));

        tx.rollback().await.unwrap();
    }
}
