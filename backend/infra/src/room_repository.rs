use bigdecimal::ToPrimitive;
use domain::{
    room::{Member, MemberId, Payment, PaymentId},
    Room, RoomId, UserId,
};
use sqlx::{types::BigDecimal, PgPool, Row};
use uuid::Uuid;

pub struct RoomRepository {
    pub pool: PgPool,
}

impl RoomRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, name: String, created_by: UserId) -> Room {
        let room_id = Uuid::new_v4().to_string();

        sqlx::query("INSERT INTO rooms (id, name, created_by) VALUES ($1, $2, $3)")
            .bind(&room_id)
            .bind(&name)
            .bind(&created_by)
            .execute(&self.pool)
            .await
            .unwrap();

        let member_id = Uuid::new_v4().to_string();
        sqlx::query("INSERT INTO room_members (id, room_id, user_id) VALUES ($1, $2, $3)")
            .bind(&member_id)
            .bind(&room_id)
            .bind(&created_by)
            .execute(&self.pool)
            .await
            .unwrap();

        Room {
            id: room_id.clone(),
            name,
            created_by: created_by.clone(),
            members: vec![Member {
                id: member_id,
                room_id,
                user_id: created_by,
                total_amount: 0,
            }],
        }
    }

    pub async fn get_by_id(&self, id: RoomId) -> Option<Room> {
        let row = sqlx::query("SELECT * FROM rooms WHERE id = $1")
            .bind(&id)
            .fetch_one(&self.pool)
            .await
            .ok()?;

        let members = sqlx::query("SELECT * FROM room_members WHERE room_id = $1")
            .bind(&id)
            .fetch_all(&self.pool)
            .await
            .unwrap();

        let each_member_total_amounts = sqlx::query(
            "SELECT room_member_id, SUM(amount) AS total_amount FROM payments WHERE room_id = $1 GROUP BY room_member_id",
        ).bind(&id)
            .fetch_all(&self.pool)
            .await
            .unwrap();

        let members = members
            .into_iter()
            .map(|row| {
                let member_id = row.get("id");
                let user_id = row.get("user_id");
                let total_amount = each_member_total_amounts
                    .iter()
                    .find(|row| row.get::<String, _>("room_member_id") == member_id)
                    .map(|row| row.get::<BigDecimal, _>("total_amount").to_u64().unwrap())
                    .unwrap_or(0);

                domain::room::Member {
                    id: member_id,
                    room_id: id.clone(),
                    user_id,
                    total_amount,
                }
            })
            .collect();

        Some(Room {
            id: row.get("id"),
            name: row.get("name"),
            created_by: row.get("created_by"),
            members,
        })
    }

    pub async fn add_member(&self, room_id: RoomId, user_id: UserId) -> Member {
        let member_id = Uuid::new_v4().to_string();

        sqlx::query("INSERT INTO room_members (id, room_id, user_id) VALUES ($1, $2, $3)")
            .bind(&member_id)
            .bind(&room_id)
            .bind(&user_id)
            .execute(&self.pool)
            .await
            .unwrap();

        Member {
            id: member_id,
            room_id,
            user_id,
            total_amount: 0,
        }
    }

    pub async fn add_payment(
        &self,
        room_id: RoomId,
        room_member_id: MemberId,
        amount: u64,
        note: Option<String>,
    ) -> Payment {
        let payment_id = Uuid::new_v4().to_string();

        sqlx::query("INSERT INTO payments (id, room_id, room_member_id, amount, note) VALUES ($1, $2, $3, $4, $5)")
            .bind(&payment_id)
            .bind(&room_id)
            .bind(&room_member_id)
            .bind(&(amount as i64))
            .bind(&note)
            .execute(&self.pool)
            .await
            .unwrap();

        Payment {
            id: payment_id,
            room_id,
            room_member_id,
            amount,
            note,
        }
    }

    pub async fn remove_payment(&self, room_id: RoomId, payment_id: PaymentId) {
        sqlx::query("DELETE FROM payments WHERE room_id = $1 AND id = $2")
            .bind(&room_id)
            .bind(&payment_id)
            .execute(&self.pool)
            .await
            .unwrap();
    }

    pub async fn get_payments(&self, room_id: RoomId) -> Vec<Payment> {
        let rows =
            sqlx::query("SELECT * FROM payments WHERE room_id = $1 ORDER BY created_at DESC")
                .bind(&room_id)
                .fetch_all(&self.pool)
                .await
                .unwrap();

        rows.into_iter()
            .map(|row| Payment {
                id: row.get("id"),
                room_id: row.get("room_id"),
                room_member_id: row.get("room_member_id"),
                amount: row.get::<i64, _>("amount") as u64,
                note: row.get("note"),
            })
            .collect()
    }
}
