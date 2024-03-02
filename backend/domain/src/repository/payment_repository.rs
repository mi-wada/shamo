use anyhow::Result;
use sqlx::{PgConnection, Row};

use crate::{
    room::{MemberId, Payment, PaymentId},
    RoomId,
};

pub async fn add(db_conn: &mut PgConnection, payment: &Payment) -> Result<()> {
    sqlx::query("INSERT INTO payments (id, room_id, room_member_id, amount, note) VALUES ($1, $2, $3, $4, $5)")
            .bind(&payment.id.0)
            .bind(&payment.room_id.0)
            .bind(&payment.room_member_id.0)
            .bind(payment.amount as i64)
            .bind(&payment.note)
            .execute(db_conn)
            .await?;

    Ok(())
}

pub async fn delete(db_conn: &mut PgConnection, id: &PaymentId) -> Result<()> {
    sqlx::query("DELETE FROM payments WHERE id = $1")
        .bind(&id.0)
        .execute(db_conn)
        .await?;

    Ok(())
}

pub async fn get_list_by_room_id(
    db_conn: &mut PgConnection,
    room_id: &crate::room::RoomId,
) -> Result<Vec<Payment>> {
    let rows = sqlx::query("SELECT * FROM payments WHERE room_id = $1  ORDER BY created_at DESC")
        .bind(&room_id.0)
        .fetch_all(db_conn)
        .await?;

    Ok(rows
        .into_iter()
        .map(|row| Payment {
            id: PaymentId(row.get("id")),
            room_id: RoomId(row.get("room_id")),
            room_member_id: MemberId(row.get("room_member_id")),
            amount: row.get::<i64, _>("amount") as u64,
            note: row.get("note"),
        })
        .collect())
}

#[cfg(test)]
mod tests {

    use sqlx::Row;

    use crate::{
        repository::test_helper::{add_room, get_tx},
        room::{payment, MemberId, PaymentId},
        RoomId,
    };

    use super::*;

    #[tokio::test]
    async fn test_add() -> Result<()> {
        let mut tx = get_tx().await;

        let room = add_room(&mut tx, None).await.unwrap();
        let payment = Payment {
            id: PaymentId::default(),
            room_id: room.id.clone(),
            room_member_id: room.members[0].id.clone(),
            amount: 100,
            note: Some("test".to_string()),
        };
        add(&mut tx, &payment).await?;

        let row = sqlx::query("SELECT * FROM payments WHERE id = $1")
            .bind(&payment.id.0)
            .fetch_one(&mut *tx)
            .await
            .unwrap();

        assert_eq!(row.get::<String, _>("id"), payment.id.0);
        assert_eq!(row.get::<String, _>("room_id"), payment.room_id.0);
        assert_eq!(
            row.get::<String, _>("room_member_id"),
            payment.room_member_id.0
        );
        assert_eq!(row.get::<i64, _>("amount"), payment.amount as i64);

        tx.rollback().await?;

        Ok(())
    }

    #[tokio::test]
    async fn test_delete() -> Result<()> {
        let mut tx = get_tx().await;

        let room = add_room(&mut tx, None).await.unwrap();
        let payment = Payment {
            id: PaymentId::default(),
            room_id: room.id.clone(),
            room_member_id: room.members[0].id.clone(),
            amount: 100,
            note: Some("test".to_string()),
        };
        add(&mut tx, &payment).await?;

        delete(&mut tx, &payment.id).await?;

        let row = sqlx::query("SELECT * FROM payments WHERE id = $1")
            .bind(&payment.id.0)
            .fetch_optional(&mut *tx)
            .await
            .unwrap();

        assert!(row.is_none());

        tx.rollback().await?;

        Ok(())
    }

    #[tokio::test]
    async fn test_get_list_by_room_id() -> Result<()> {
        let mut tx = get_tx().await;

        let room = add_room(&mut tx, None).await.unwrap();
        let payment = Payment {
            id: PaymentId::default(),
            room_id: room.id.clone(),
            room_member_id: room.members[0].id.clone(),
            amount: 100,
            note: Some("test".to_string()),
        };
        add(&mut tx, &payment).await?;

        let payments = get_list_by_room_id(&mut tx, &room.id).await.unwrap();
        assert_eq!(payments.len(), 1);
        assert_eq!(payments[0].id.0, payment.id.0);

        tx.rollback().await?;

        Ok(())
    }
}
