-- Raghavendra Engineers — MySQL Database Schema
-- Run in MySQL Workbench or: mysql -u root -p < database/init.sql
-- Default admin (Administrator / Admin@123) is created automatically when the API starts.

CREATE DATABASE IF NOT EXISTS raghavendra_enge_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE raghavendra_enge_db;

CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(50)   NOT NULL DEFAULT 'Administrator',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generators (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200)   NOT NULL,
  brand       VARCHAR(100)   NOT NULL,
  type        VARCHAR(50)    NOT NULL,
  power_kva   DECIMAL(10,2)  NOT NULL,
  frequency   VARCHAR(10)    NOT NULL DEFAULT '50Hz',
  description TEXT           NOT NULL,
  price       DECIMAL(12,2)  NOT NULL DEFAULT 0,
  image_url   VARCHAR(500)   NULL,
  is_active   TINYINT(1)     NOT NULL DEFAULT 1,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotations (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  quotation_no      VARCHAR(50)   NOT NULL,
  customer_name     VARCHAR(200)  NOT NULL,
  email             VARCHAR(200)  NULL,
  phone             VARCHAR(20)   NOT NULL,
  company           VARCHAR(200)  NULL,
  address           VARCHAR(500)  NOT NULL,
  brand             VARCHAR(100)  NULL,
  equipment_details TEXT          NULL,
  power_kva         VARCHAR(100)  NULL,
  selected_services TEXT          NOT NULL,
  message           TEXT          NULL,
  urgency           VARCHAR(50)   NOT NULL DEFAULT 'Normal',
  status            VARCHAR(50)   NOT NULL DEFAULT 'Pending',
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_quotations_status (status),
  INDEX idx_quotations_created (created_at)
);
