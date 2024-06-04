resource "google_cloud_run_domain_mapping" "dns" {
  location = var.region
  name     = "metro-minute.fr"

  metadata {
    namespace = "metro-minute"
  }

  spec {
    route_name = google_cloud_run_v2_service.metro-minute-web-app.name
  }

  
}