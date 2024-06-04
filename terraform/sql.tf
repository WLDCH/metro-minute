resource "random_password" "postgres_password" {
  length  = 16
  special = true
}

resource "google_sql_database_instance" "metro_minute_postgres" {
  name                = "metro-minute-postgres"
  database_version    = "POSTGRES_13"
  deletion_protection = false
  region              = var.region

  settings {
    tier              = "db-f1-micro"
    edition           = "ENTERPRISE"
    disk_size         = 10
    availability_type = "ZONAL"
  }
}

resource "google_sql_database" "metro_minute_database" {
  name     = "metrominute"
  instance = google_sql_database_instance.metro_minute_postgres.name
}

resource "google_sql_user" "metro_minute_postgres_user" {
  name     = "postgres"
  instance = google_sql_database_instance.metro_minute_postgres.name
  password = random_password.postgres_password.result
}

output "cloud_sql_instance_ip" {
  value       = google_sql_database_instance.metro_minute_postgres.public_ip_address
  description = "The public IP address of the Cloud SQL instance."
}