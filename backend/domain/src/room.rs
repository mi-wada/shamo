mod member;
pub use member::{Member, MemberId};

mod payment;
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
    pub name: String,
    pub emoji: String,
    pub created_by: UserId,
    pub members: Vec<Member>,
}
