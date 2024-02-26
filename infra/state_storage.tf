resource "google_storage_bucket" "terraform_state_bucket" {
  name          = "shamo-mtak-app-terraform-state-bucket"
  location      = "us-west1"
  storage_class = "REGIONAL"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 5
    }

    action {
      type = "Delete"
    }
  }
}
