variable "cloudflare_zone_id" {
  description = "The zone ID of mtak.app"
  type        = string
}

resource "cloudflare_record" "web" {
  zone_id = var.cloudflare_zone_id
  type    = "CNAME"
  name    = "shamo"
  value   = "cname.vercel-dns.com"
  proxied = true
}

resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  type    = "CNAME"
  name    = "shamo-api"
  value   = "ghs.googlehosted.com"
  proxied = true
}

resource "cloudflare_record" "gcp_domain_verification" {
  zone_id = var.cloudflare_zone_id
  type    = "TXT"
  name    = "mtak.app"
  value   = "google-site-verification=BKXOrOgjzzvbD1pgj6khj57nwkj1kRb7Bfbgl961b20"
}
