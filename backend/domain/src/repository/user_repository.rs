use anyhow::Result;
use sqlx::PgConnection;

use crate::{User, UserId};

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

pub async fn update(db_conn: &mut PgConnection, user: &User) -> Result<()> {
    sqlx::query(
        r#"
        UPDATE users
        SET name = $2, icon_url = $3
        WHERE id = $1
        "#,
    )
    .bind(&user.id.0)
    .bind(&user.name)
    .bind(&user.icon_url)
    .execute(db_conn)
    .await?;

    Ok(())
}

pub async fn get_by_id(db_conn: &mut PgConnection, id: &UserId) -> Result<Option<User>> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(db_conn)
        .await?;

    Ok(user)
}

#[cfg(test)]
mod tests {
    use anyhow::Ok;

    use crate::{repository::test_helper::get_tx, User, UserId};

    use super::*;

    #[tokio::test]
    async fn test_add() -> Result<()> {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::default(),
            name: "test".to_string(),
            icon_url: None,
        };
        add(&mut tx, &user).await?;

        let added_user = get_by_id(&mut tx, &user.id).await?.unwrap();
        assert_eq!(added_user.id.0, user.id.0);
        assert_eq!(added_user.name, user.name);
        assert_eq!(added_user.icon_url, user.icon_url);

        tx.rollback().await?;
        Ok(())
    }

    #[tokio::test]
    async fn test_get_by_id() -> Result<()> {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::default(),
            name: "test".to_string(),
            icon_url: None,
        };
        add(&mut tx, &user).await?;

        let got_user = get_by_id(&mut tx, &user.id).await?.unwrap();
        assert_eq!(got_user.id.0, user.id.0);
        assert_eq!(got_user.name, user.name);
        assert_eq!(got_user.icon_url, user.icon_url);

        tx.rollback().await?;
        Ok(())
    }

    #[tokio::test]
    async fn test_update() -> Result<()> {
        let mut tx = get_tx().await;

        let user = User {
            id: UserId::default(),
            name: "test".to_string(),
            icon_url: None,
        };
        add(&mut tx, &user).await?;

        let updated_user = User {
            id: user.id.clone(),
            name: "new_name".to_string(),
            icon_url: Some("https://example.com".to_string()),
        };
        update(&mut tx, &updated_user).await?;

        let updated_user = get_by_id(&mut tx, &user.id).await?.unwrap();
        assert_eq!(updated_user.id.0, user.id.0);
        assert_eq!(updated_user.name, "new_name");
        assert_eq!(
            updated_user.icon_url,
            Some("https://example.com".to_string())
        );

        tx.rollback().await?;
        Ok(())
    }
}
