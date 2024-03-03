use anyhow::Result;
use sqlx::PgConnection;

use crate::{
    room::{Member, MemberId},
    Room, RoomId, User, UserId,
};

pub async fn add(db_conn: &mut PgConnection, room: &Room) -> Result<()> {
    sqlx::query("INSERT INTO rooms (id, name, emoji, created_by) VALUES ($1, $2, $3, $4)")
        .bind(&room.id.0)
        .bind(&room.name)
        .bind(&room.emoji)
        .bind(&room.created_by.0)
        .execute(&mut *db_conn)
        .await?;

    for member in &room.members {
        sqlx::query("INSERT INTO room_members (id, room_id, user_id) VALUES ($1, $2, $3)")
            .bind(&member.id.0)
            .bind(&room.id.0)
            .bind(&member.user.id.0)
            .execute(&mut *db_conn)
            .await?;
    }

    Ok(())
}

pub async fn add_member(
    db_conn: &mut PgConnection,
    member_id: MemberId,
    room_id: RoomId,
    user_id: UserId,
) -> Result<Member> {
    sqlx::query("INSERT INTO room_members (id, room_id, user_id) VALUES ($1, $2, $3)")
        .bind(&member_id)
        .bind(&room_id)
        .bind(&user_id)
        .execute(&mut *db_conn)
        .await?;

    Ok(Member {
        id: member_id,
        room_id,
        user: User {
            id: user_id,
            name: "".to_string(),
            icon_url: None,
        },
        total_amount: 0,
    })
}

#[cfg(test)]
mod tests {

    use sqlx::Row;

    use crate::{
        repository::test_helper::{add_room, add_user, get_tx},
        room::{Member, MemberId},
        RoomId,
    };

    use super::*;

    #[tokio::test]
    async fn test_add() {
        let mut tx = get_tx().await;

        let user = add_user(&mut tx, None).await.unwrap();
        let user_id = user.id.clone();
        let room_id = RoomId::default();
        let room = Room {
            id: room_id.clone(),
            name: "test".to_string(),
            emoji: "🍣".to_string(),
            created_by: user.id.clone(),
            members: vec![Member {
                id: MemberId::default(),
                room_id,
                user,
                total_amount: 0,
            }],
        };
        add(&mut tx, &room).await.unwrap();

        let room_row = sqlx::query("SELECT * FROM rooms WHERE id = $1")
            .bind(&room.id.0)
            .fetch_one(&mut *tx)
            .await
            .unwrap();
        assert_eq!(room_row.get::<String, _>("id"), room.id.0);
        assert_eq!(room_row.get::<String, _>("name"), room.name);
        assert_eq!(room_row.get::<String, _>("emoji"), room.emoji);
        assert_eq!(room_row.get::<String, _>("created_by"), room.created_by.0);

        let room_member_row = sqlx::query("SELECT * FROM room_members WHERE room_id = $1")
            .bind(&room.id.0)
            .fetch_one(&mut *tx)
            .await
            .unwrap();
        assert_eq!(room_member_row.get::<String, _>("room_id"), room.id.0);
        assert_eq!(room_member_row.get::<String, _>("user_id"), user_id.0);

        tx.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn test_add_member() {
        let mut tx = get_tx().await;

        let user = add_user(&mut tx, None).await.unwrap();
        let room = add_room(&mut tx, None).await.unwrap();

        add_member(
            &mut tx,
            MemberId::default(),
            room.id.clone(),
            user.id.clone(),
        )
        .await
        .unwrap();

        let room_member_row =
            sqlx::query("SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2")
                .bind(&room.id)
                .bind(&user.id)
                .fetch_one(&mut *tx)
                .await
                .unwrap();
        assert_eq!(room_member_row.get::<String, _>("room_id"), room.id.0);
        assert_eq!(room_member_row.get::<String, _>("user_id"), user.id.0);

        tx.rollback().await.unwrap();
    }
}
