mod member;

pub use member::{Member, MemberId};

pub mod payment;
pub use payment::{Payment, PaymentId};

use crate::UserId;

use uuid::Uuid;

#[derive(serde::Serialize, Clone)]
pub struct RoomId(pub String);

impl Default for RoomId {
    fn default() -> Self {
        Self(Uuid::now_v7().to_string())
    }
}

#[derive(serde::Serialize)]
pub struct Room {
    pub id: RoomId,
    // TODO: 名前の長さに制限をかける
    pub name: String,
    // TODO: Charでいいな
    // TODO: emoji文字列のバリデーション。
    pub emoji: String,
    // TODO: ownerとかにするか？
    pub created_by: UserId,
    // TODO: Vec<UserId>でいいな
    // TODO: ユニークである必要がある
    pub members: Vec<Member>,
}

#[async_trait::async_trait]
pub trait RoomRepository {
    async fn save(&mut self, room: &Room);
}
