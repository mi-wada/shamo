variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "gcp_project_id" {
  description = "The GCP project ID"
  type        = string
}
provider "google" {
  project = var.gcp_project_id
}
