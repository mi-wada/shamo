use anyhow::Result;
use domain::{
    repository::payment_repository,
    room::{MemberId, Payment, PaymentId},
    RoomId,
};
use sqlx::{Acquire, PgConnection};

pub async fn add_payment(
    db_conn: &mut PgConnection,
    room_id: RoomId,
    room_member_id: MemberId,
    amount: u64,
    note: Option<String>,
) -> Result<Payment> {
    let payment = Payment {
        id: PaymentId::default(),
        room_id,
        room_member_id,
        amount,
        note,
    };

    let mut tx = db_conn.begin().await?;
    payment_repository::add(&mut tx, &payment).await?;
    tx.commit().await?;

    Ok(payment)
}

#[cfg(test)]
mod tests {
    use domain::repository;
    use sqlx::Row;

    use super::*;

    #[tokio::test]
    async fn test_add_payment() -> Result<()> {
        let mut tx = repository::test_helper::get_tx().await;

        let room = repository::test_helper::add_room(&mut tx, None)
            .await
            .unwrap();
        let payment = add_payment(
            &mut tx,
            room.id.clone(),
            room.members[0].id.clone(),
            100,
            Some("test".to_string()),
        )
        .await?;

        let row = sqlx::query("SELECT * FROM payments WHERE id = $1")
            .bind(&payment.id.0)
            .fetch_one(&mut *tx)
            .await?;
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
}
