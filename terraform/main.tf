terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.25"
    }
  }

  required_version = ">= 1.3.0"
}

provider "google" {
  project = var.project
  region  = var.region
}

variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "api_token" {
  description = "API token for accessing PRIM API"
  type        = string
  sensitive   = true
}

