use domain::{User, UserId};
use sqlx::{PgPool, Row};

pub struct UserRepository {
    pub pool: PgPool,
}

impl UserRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, id: UserId, name: String, icon_url: Option<String>) -> User {
        sqlx::query("INSERT INTO users (id, name, icon_url) VALUES ($1, $2, $3)")
            .bind(&id)
            .bind(&name)
            .bind(&icon_url)
            .execute(&self.pool)
            .await
            .unwrap();

        User { id, name, icon_url }
    }

    pub async fn get_by_id(&self, id: UserId) -> Option<User> {
        let row = sqlx::query("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .unwrap();

        match row {
            None => None,
            Some(row) => Some(User {
                id: row.get("id"),
                name: row.get("name"),
                icon_url: row.get("icon_url"),
            }),
        }
    }
}
