use uuid::Uuid;

use crate::{RoomId, User};

#[derive(serde::Serialize, Clone, sqlx::Type, PartialEq, Debug)]
#[sqlx(transparent)]
pub struct MemberId(pub String);

impl Default for MemberId {
    fn default() -> Self {
        Self(Uuid::now_v7().to_string())
    }
}

#[derive(serde::Serialize, sqlx::FromRow)]
pub struct Member {
    pub id: MemberId,
    pub room_id: RoomId,
    #[sqlx(skip)]
    pub user: User,
    #[sqlx(skip)]
    pub total_amount: u64,
}
