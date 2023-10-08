use domain::{
    room::{Member, MemberId, RoomRepository as RoomRepositoryTrait},
    Room, RoomId, User, UserId,
};
use sqlx::{Connection, PgConnection};

pub struct RoomRepository<'a> {
    pub conn: &'a mut PgConnection,
}

#[async_trait::async_trait]
impl<'a> RoomRepositoryTrait for RoomRepository<'a> {
    async fn save(&mut self, room: &Room) {
        let mut tx = self.conn.begin().await.unwrap();

        sqlx::query("INSERT INTO rooms (id, name, emoji, created_by) VALUES ($1, $2, $3, $4)")
            .bind(&room.id.0)
            .bind(&room.name)
            .bind(&room.emoji)
            .bind(&room.created_by.0)
            .execute(&mut *tx)
            .await
            .unwrap();

        sqlx::query("INSERT INTO room_members (id, room_id, user_id) VALUES ($1, $2, $3)")
            .bind(&room.members[0].id.0)
            .bind(&room.id.0)
            .bind(&room.created_by.0)
            .execute(&mut *tx)
            .await
            .unwrap();

        tx.commit().await.unwrap();
    }
}

impl<'a> RoomRepository<'a> {
    pub async fn add_member(&mut self, room_id: RoomId, user_id: UserId) -> Member {
        let member_id = MemberId::default();

        sqlx::query("INSERT INTO room_members (id, room_id, user_id) VALUES ($1, $2, $3)")
            .bind(&member_id.0)
            .bind(&room_id.0)
            .bind(&user_id.0)
            .execute(&mut *self.conn)
            .await
            .unwrap();

        Member {
            id: member_id,
            room_id,
            user: User {
                id: user_id,
                name: "".to_string(),
                icon_url: None,
            },
            total_amount: 0,
        }
    }
}
