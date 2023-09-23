#[derive(serde::Serialize)]
pub struct ErrorResponseBody {
    pub errors: Vec<ErrorItem>,
}

#[derive(serde::Serialize)]
pub struct ErrorItem {
    pub field: String,
    pub code: String,
    pub message: String,
}

// TODO: エラー型から
