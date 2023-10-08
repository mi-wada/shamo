use uuid::Uuid;

#[derive(serde::Serialize, Clone)]
pub struct UserId(pub String);

impl Default for UserId {
    fn default() -> Self {
        Self(Uuid::now_v7().to_string())
    }
}

#[derive(serde::Serialize)]
pub struct User {
    pub id: UserId,
    pub name: String,
    pub icon_url: Option<String>,
}

impl User {
    pub fn change_name(self, name: String) -> Self {
        User { name, ..self }
    }
}

#[async_trait::async_trait]
pub trait UserRepository {
    async fn save(&mut self, user: &User);
    async fn get_by_id(&mut self, id: UserId) -> Option<User>;
}
