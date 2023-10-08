use bigdecimal::ToPrimitive;
use domain::{room::MemberId, Room, RoomId, User, UserId};
use sqlx::{types::BigDecimal, PgConnection, PgPool, Row};
use usecase::query::room_query::{RoomQuery as RoomQueryTrait, RoomQueryResult};

pub struct RoomQuery<'a> {
    pub conn: &'a mut PgConnection,
}

#[async_trait::async_trait]
impl<'a> RoomQueryTrait for RoomQuery<'a> {
    async fn get_by_id(&mut self, id: RoomId) -> Option<RoomQueryResult> {
        let row = sqlx::query("SELECT * FROM rooms WHERE id = $1")
            .bind(&id.0)
            .fetch_one(&mut *self.conn)
            .await
            .ok()?;

        let members = sqlx::query("SELECT room_members.id AS room_member_id, * FROM room_members JOIN users ON room_members.user_id = users.id WHERE room_id = $1")
            .bind(&id.0)
            .fetch_all(&mut *self.conn)
            .await
            .unwrap();

        let each_member_total_amounts = sqlx::query(
            "SELECT room_member_id, SUM(amount) AS total_amount FROM payments WHERE room_id = $1 GROUP BY room_member_id",
        ).bind(&id.0)
            .fetch_all(&mut *self.conn)
            .await
            .unwrap();

        let members = members
            .into_iter()
            .map(|row| {
                let member_id = MemberId(row.get("room_member_id"));
                let user = User {
                    id: UserId(row.get("user_id")),
                    name: row.get("name"),
                    icon_url: row.get("icon_url"),
                };
                let total_amount = each_member_total_amounts
                    .iter()
                    .find(|row| row.get::<String, _>("room_member_id") == member_id.0)
                    .map(|row| row.get::<BigDecimal, _>("total_amount").to_u64().unwrap())
                    .unwrap_or(0);

                domain::room::Member {
                    id: member_id,
                    room_id: id.clone(),
                    user,
                    total_amount,
                }
            })
            .collect();

        Some(RoomQueryResult {
            id: RoomId(row.get("id")),
            name: row.get("name"),
            emoji: row.get("emoji"),
            created_by: UserId(row.get("created_by")),
            members,
        })
    }
}
