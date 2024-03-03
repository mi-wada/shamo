use anyhow::Result;
use domain::{
    repository::{room_repository, user_repository},
    room::{Member, MemberId},
    Room, RoomId, UserId,
};

pub async fn create_room(
    db_conn: &mut sqlx::PgConnection,
    name: String,
    emoji: String,
    created_by: UserId,
) -> Result<Room> {
    // TODO: add error handling when user not found
    let user = user_repository::get_by_id(db_conn, &created_by)
        .await?
        .unwrap();

    let room_id = RoomId::default();
    let room = Room {
        id: room_id.clone(),
        name,
        emoji,
        created_by: created_by.clone(),
        members: vec![Member {
            id: MemberId::default(),
            room_id,
            user,
            total_amount: 0,
        }],
    };

    room_repository::add(db_conn, &room).await?;

    Ok(room)
}

#[cfg(test)]
mod tests {
    use domain::repository::test_helper::{self, get_tx};

    use super::*;

    #[tokio::test]
    async fn test_create_room() -> Result<()> {
        let mut tx = get_tx().await;

        let user = test_helper::add_user(&mut tx, None).await?;
        let room = create_room(
            &mut tx,
            "修学旅行".to_string(),
            "🍣".to_string(),
            user.id.clone(),
        )
        .await?;

        let created_room = sqlx::query_as::<_, Room>("SELECT * FROM rooms WHERE id = $1")
            .bind(&room.id.0)
            .fetch_one(&mut *tx)
            .await?;
        assert_eq!(created_room.id.0, room.id.0);
        assert_eq!(created_room.name, room.name);
        assert_eq!(created_room.emoji, room.emoji);
        assert_eq!(created_room.created_by.0, room.created_by.0);
        let created_members =
            sqlx::query_as::<_, Member>("SELECT * FROM room_members WHERE room_id = $1")
                .bind(&room.id.0)
                .fetch_all(&mut *tx)
                .await?;

        assert_eq!(created_members.len(), 1);
        assert_eq!(created_members[0].id.0, room.members[0].id.0);
        assert_eq!(created_members[0].room_id.0, room.id.0);

        tx.rollback().await?;
        Ok(())
    }
}
