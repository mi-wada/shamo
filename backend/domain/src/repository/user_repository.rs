use anyhow::Result;
use sqlx::PgConnection;

use crate::User;

pub async fn add(db_conn: &mut PgConnection, user: &User) -> Result<()> {
    sqlx::query(
        r#"
        INSERT INTO users (id, name, icon_url)
        VALUES ($1, $2, $3)
        "#,
    )
    .bind(&user.id.0)
    .bind(&user.name)
    .bind(&user.icon_url)
    .execute(db_conn)
    .await?;

    Ok(())
}

#[cfg(test)]
mod tests {

    use sqlx::Row;

    use crate::{repository::test_helper::get_tx, User, UserId};

    use super::*;

    #[tokio::test]
    async fn test_add() {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::default(),
            name: "test".to_string(),
            icon_url: None,
        };
        add(&mut tx, &user).await.unwrap();

        let added_user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(&user.id.0)
            .fetch_one(&mut *tx)
            .await
            .unwrap();
        assert_eq!(added_user.id.0, user.id.0);
        assert_eq!(added_user.name, user.name);
        assert_eq!(added_user.icon_url, user.icon_url);

        tx.rollback().await.unwrap();
    }
}
