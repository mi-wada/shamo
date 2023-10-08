use domain::{
    room::{payment::PaymentRepository as PaymentRepositoryTrait, MemberId, Payment, PaymentId},
    RoomId,
};
use sqlx::{PgConnection, Row};

pub struct PaymentRepository<'a> {
    pub conn: &'a mut PgConnection,
}

#[async_trait::async_trait]
impl<'a> PaymentRepositoryTrait for PaymentRepository<'a> {
    async fn save(&mut self, payment: &Payment) {
        sqlx::query("INSERT INTO payments (id, room_id, room_member_id, amount, note) VALUES ($1, $2, $3, $4, $5)")
            .bind(&payment.id.0)
            .bind(&payment.room_id.0)
            .bind(&payment.room_member_id.0)
            .bind(payment.amount as i64)
            .bind(&payment.note)
            .execute(&mut *self.conn)
            .await
            .unwrap();
    }

    async fn get_payments_by_room_id(&mut self, room_id: RoomId) -> Vec<Payment> {
        let rows =
            sqlx::query("SELECT * FROM payments WHERE room_id = $1 ORDER BY created_at DESC")
                .bind(&room_id.0)
                .fetch_all(&mut *self.conn)
                .await
                .unwrap();

        rows.into_iter()
            .map(|row| Payment {
                id: PaymentId(row.get("id")),
                room_id: RoomId(row.get("room_id")),
                room_member_id: MemberId(row.get("room_member_id")),
                amount: row.get::<i64, _>("amount") as u64,
                note: row.get("note"),
            })
            .collect()
    }

    async fn delete(&mut self, id: PaymentId) {
        sqlx::query("DELETE FROM payments WHERE id = $1")
            .bind(&id.0)
            .execute(&mut *self.conn)
            .await
            .unwrap();
    }
}
