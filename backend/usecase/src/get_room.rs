use anyhow::Result;
use bigdecimal::ToPrimitive;
use domain::{room::Member, Room, RoomId, UserId};
use sqlx::{types::BigDecimal, Row};

#[derive(serde::Serialize)]
pub struct GetRoomResult {
    pub id: RoomId,
    pub name: String,
    pub emoji: String,
    pub created_by: UserId,
    pub members: Vec<Member>,
}

pub async fn get_room(conn: &mut sqlx::PgConnection, id: &RoomId) -> Result<Option<GetRoomResult>> {
    let room = sqlx::query_as::<_, Room>("SELECT * FROM rooms WHERE id = $1")
        .bind(&id.0)
        .fetch_optional(&mut *conn)
        .await?;

    let room = match room {
        Some(room) => room,
        None => return Ok(None),
    };

    let room_members = sqlx::query(
        "
    SELECT
        rm.id AS room_member_id,
        rm.room_id,
        u.id AS user_id,
        u.name,
        u.icon_url,
        COALESCE(SUM(p.amount), 0) AS total_amount
    FROM
        room_members rm
    JOIN
        users u ON rm.user_id = u.id
    LEFT JOIN
        payments p ON rm.id = p.room_member_id
    WHERE
        rm.room_id = $1
    GROUP BY
        rm.id, u.id",
    )
    .bind(&id.0)
    .fetch_all(&mut *conn)
    .await?
    .into_iter()
    .map(|row| Member {
        id: row.get("room_member_id"),
        room_id: row.get("room_id"),
        user: domain::User {
            id: row.get("user_id"),
            name: row.get("name"),
            icon_url: row.get("icon_url"),
        },
        total_amount: row.get::<BigDecimal, _>("total_amount").to_u64().unwrap(),
    })
    .collect::<Vec<_>>();

    Ok(Some(GetRoomResult {
        id: room.id,
        name: room.name,
        emoji: room.emoji,
        created_by: room.created_by,
        members: room_members,
    }))
}

#[cfg(test)]
mod tests {
    use domain::repository::test_helper::{add_room, get_tx};

    use crate::add_payment;

    use super::*;

    #[tokio::test]
    async fn test_get_room() -> Result<()> {
        let mut tx = get_tx().await;

        let room = add_room(&mut tx, None).await.unwrap();
        add_payment(
            &mut *tx,
            room.id.clone(),
            room.members[0].id.clone(),
            100,
            None,
        )
        .await?;
        add_payment(
            &mut *tx,
            room.id.clone(),
            room.members[0].id.clone(),
            200,
            None,
        )
        .await?;
        let result = get_room(&mut tx, &room.id).await?.unwrap();

        assert_eq!(result.id, room.id);
        assert_eq!(result.emoji, room.emoji);
        assert_eq!(result.created_by, room.created_by);
        assert_eq!(result.members.len(), 1);
        assert_eq!(result.members[0].id, room.members[0].id);
        assert_eq!(result.members[0].room_id, room.members[0].room_id);
        assert_eq!(result.members[0].user.id, room.members[0].user.id);
        assert_eq!(result.members[0].user.name, room.members[0].user.name);
        assert_eq!(
            result.members[0].user.icon_url,
            room.members[0].user.icon_url
        );
        assert_eq!(result.members[0].total_amount, 300);

        Ok(())
    }
}
