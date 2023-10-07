use domain::{User, UserId};
use sqlx::{PgConnection, Row};

pub struct UserRepository;

impl UserRepository {
    pub async fn save(user: &User, conn: &mut PgConnection) {
        sqlx::query(
            "
        INSERT INTO users (id, name, icon_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET name = $2, icon_url = $3
        ",
        )
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
    use crate::test_helper::get_tx;

    use super::*;
    use domain::UserId;

    #[tokio::test]
    async fn test_save_when_create() {
        let mut tx = get_tx().await;

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

    #[tokio::test]
    async fn test_ok_save_when_update() {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::new(),
            name: "test".to_string(),
            icon_url: Some("https://example.com".to_string()),
        };
        UserRepository::save(&user, &mut tx).await;

        let user = user.change_name("new_name".into());
        UserRepository::save(&user, &mut tx).await;

        let user = UserRepository::get_by_id(user.id, &mut tx).await.unwrap();
        assert_eq!(user.name, "new_name");
        assert_eq!(user.icon_url, Some("https://example.com".to_string()));

        tx.rollback().await.unwrap();
    }
}
