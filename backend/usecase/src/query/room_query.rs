use domain::{room::Member, RoomId, UserId};

#[derive(serde::Serialize)]
pub struct RoomQueryResult {
    pub id: RoomId,
    pub name: String,
    pub emoji: String,
    pub created_by: UserId,
    pub members: Vec<Member>,
}

pub struct RoomQueryService<'a> {
    pub room_query: Box<dyn RoomQuery + Send + 'a>,
}

#[async_trait::async_trait]
pub trait RoomQuery {
    async fn get_by_id(&mut self, id: RoomId) -> Option<RoomQueryResult>;
}
