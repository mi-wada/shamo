pub type UserId = String;

#[derive(serde::Serialize)]
pub struct User {
    pub id: UserId,
    pub name: String,
    pub picture_url: Option<String>,
}
