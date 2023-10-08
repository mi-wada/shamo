use domain::{user::UserRepository as UserRepositoryTrait, User, UserId};
use sqlx::{PgConnection, Row};

pub struct UserRepository<'a> {
    pub conn: &'a mut PgConnection,
}

#[async_trait::async_trait]
impl<'a> UserRepositoryTrait for UserRepository<'a> {
    async fn save(&mut self, user: &User) {
        sqlx::query(
            "
        INSERT INTO users (id, name, icon_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET name = $2, icon_url = $3
        ",
        )
        .bind(&user.id.0)
        .bind(&user.name)
        .bind(&user.icon_url)
        .execute(&mut *self.conn)
        .await
        .unwrap();
    }

    async fn get_by_id(&mut self, id: UserId) -> Option<User> {
        let row = sqlx::query("SELECT * FROM users WHERE id = $1")
            .bind(id.0)
            .fetch_optional(&mut *self.conn)
            .await
            .unwrap();

        row.map(|row| User {
            id: UserId(row.get("id")),
            name: row.get("name"),
            icon_url: row.get("icon_url"),
        })
    }
}

#[cfg(test)]
mod tests {
    use crate::test_helper::get_tx;

    use super::*;
    use domain::UserId;

    #[tokio::test]
    async fn test_save_when_create() {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::default(),
            name: "test".to_string(),
            icon_url: Some("https://example.com".to_string()),
        };
        UserRepository { conn: &mut tx }.save(&user).await;

        let user = UserRepository { conn: &mut tx }
            .get_by_id(user.id)
            .await
            .unwrap();
        assert_eq!(user.name, "test");
        assert_eq!(user.icon_url, Some("https://example.com".to_string()));

        tx.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn test_ok_save_when_update() {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::default(),
            name: "test".to_string(),
            icon_url: Some("https://example.com".to_string()),
        };
        UserRepository { conn: &mut tx }.save(&user).await;

        let user = user.change_name("new_name".into());
        UserRepository { conn: &mut tx }.save(&user).await;

        let user = UserRepository { conn: &mut tx }
            .get_by_id(user.id)
            .await
            .unwrap();
        assert_eq!(user.name, "new_name");
        assert_eq!(user.icon_url, Some("https://example.com".to_string()));

        tx.rollback().await.unwrap();
    }
}
