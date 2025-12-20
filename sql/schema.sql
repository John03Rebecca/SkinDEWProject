-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: switchback.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--
CREATE DATABASE IF NOT EXISTS estore_db;
USE estore_db;


DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `zip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'777 Admin Ave','ON','Canada','Z9Z9Z9','123-456-7890'),(2,'77 fear st','ON','CA','M23K34','5849329845'),(3,'pantalone ln','toon','Canada','400120',''),(4,'Not provided','Not provided','Not provided','00000','0000000000'),(5,'Not provided','Not provided','Not provided','00000','0000000000'),(6,'Not provided','Not provided','Not provided','00000','0000000000'),(7,'68 Winters Ln, North York, ON M3J 1P3','ON','Canada','M3J 1P3',''),(8,'jane','on','ca','meu1345','6479177450'),(9,'Not provided','Not provided','Not provided','00000','0000000000');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user` (`user_id`),
  UNIQUE KEY `uniq_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_item` (`user_id`,`item_id`),
  UNIQUE KEY `uniq_session_item` (`session_id`,`item_id`),
  KEY `item_id` (`item_id`),
  KEY `idx_session` (`session_id`),
  KEY `idx_cart_session` (`session_id`),
  KEY `idx_cart_user` (`user_id`),
  CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (5,NULL,4,1,'FYkq2clI_tHvXrPd-9vYBHRKu5zaNCTw'),(6,NULL,1,1,'oppEoSzN-3-RfifPrmZ6Aqpwdmi_0xHX'),(7,NULL,1,1,'p6J8RDBCaKaIMZ0lWaQ6bldmyYz4IrZT'),(8,NULL,1,1,'DLN4Wqz5EtCTK3wKWF-InS4ssXLj_-f7'),(9,NULL,1,1,'V0c2d_NbUWxU6E0U9sPOWxFQwlyrSA-h'),(10,NULL,1,1,'IHsDDgG67GNlVk91wUxpb1AFWpU7hj0M'),(11,NULL,1,1,'nk_md54nInyC-d3hYpPv8yoGAG1idFk1'),(12,NULL,1,1,'iEOLJz2lqeA8NdVg-rzMPIh2g9-wsp7j'),(13,NULL,1,1,'GKb-XSrP7_U0pYRTLHYa_bJJUZM9YDC8'),(14,NULL,1,1,'xZbIcmQkNj6DSpqySHcv17k_z5pwBaaO'),(15,NULL,1,1,'_SrH1GqVgPH-MciqIaAOVoVtD8DQCzo0'),(18,NULL,1,1,'UVNSye1QETp779JJy9nrCjxsMdd8jr-b'),(19,NULL,1,1,'Myl5ABgtmfFzVlDBBQsGJa4DxRbpsL_3'),(27,NULL,1,1,'44BbqTXIBdLqvQ2R_zBZszdD_hvwdC58'),(29,NULL,1,3,'wvJ-4XzU5WCoL8MxW4LcHtZrT3EZMQ7I'),(30,NULL,1,1,'E4l4vczkqih9z3eesSXwQg9bNWKNRT4u'),(31,NULL,5,1,'E4l4vczkqih9z3eesSXwQg9bNWKNRT4u'),(32,NULL,9,1,'E4l4vczkqih9z3eesSXwQg9bNWKNRT4u'),(33,NULL,14,1,'E4l4vczkqih9z3eesSXwQg9bNWKNRT4u'),(68,8,1,1,NULL),(70,8,3,1,NULL);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `itemID` (`itemID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'CL001','Hydrating Facial Cleanser','Gentle non-foaming cleanser for normal to dry skin.','Cleanser','CeraVe',44,18.00,'/images/cerave-hydrating-cleanser.jpg'),(2,'CL002','Squalane Cleanser','Balm-to-oil cleanser that dissolves makeup and impurities.','Cleanser','The Ordinary',52,14.50,'/images/to-squalane-cleanser.jpg'),(3,'TN001','Glycolic Acid 7% Toning Solution','Exfoliating toner to improve skin texture and brightness.','Toner','The Ordinary',80,13.20,'/images/to-glycolic-toner.jpg'),(4,'TN002','PHA Glow Toner','Gentle PHA toner for smoother, brighter-looking skin.','Toner','Glow Recipe',28,32.00,'/images/gr-pha-toner.jpg'),(5,'SR001','Niacinamide 10% + Zinc 1%','Helps reduce blemishes and balance sebum.','Serum','The Ordinary',98,9.00,'/images/to-niacinamide.jpg'),(6,'SR002','Hyaluronic Acid 2% + B5','Hydration support formula with hyaluronic acid.','Serum','The Ordinary',89,9.90,'/images/to-hyaluronic.jpg'),(7,'SR003','10% Azelaic Acid Booster','Brightening serum that targets post-acne marks.','Serum','Paula\'s Choice',10,39.00,'/images/pc-azelaic.jpg'),(8,'M0001','Natural Moisturizing Factors + HA','Surface hydration cream for all skin types.','Moisturizer','The Ordinary',79,13.50,'/images/to-nmf.jpg'),(9,'M0002','Moisture Surge 100H Hydrator','Gel-cream moisturizer for long-lasting hydration.','Moisturizer','Clinique',20,52.00,'/images/clinique-moisture-surge.jpg'),(10,'EX001','2% BHA Liquid Exfoliant','Leave-on exfoliant that unclogs pores and smooths skin.','Exfoliant','Paula\'s Choice',45,38.00,'/images/pc-bha.jpg'),(11,'EX002','AHA 30% + BHA 2% Peeling Solution','10-minute exfoliating facial peel.','Exfoliant','The Ordinary',10,11.00,'/images/to-aha-bha-peel.jpg'),(12,'MS001','Niacinamide Brightening Mask','Wash-off mask to even tone and brighten.','Mask','Innisfree',30,25.00,'/images/innisfree-niacinamide-mask.jpg'),(13,'SS001','UV Sheer SPF 50 Sunscreen','Broad-spectrum SPF 50 for face & body.','Sunscreen','La Roche???Posay',38,42.00,'/images/lrp-uv-sheer.jpg'),(14,'SS002','Invisible Shield SPF 35','Lightweight clear sunscreen gel.','Sunscreen','Glossier',33,29.00,'/images/glossier-invisible-shield.jpg'),(15,'TR001','Retinol 0.2% in Squalane','Low-strength retinol in squalane for beginners.','Treatment','The Ordinary',40,13.00,'/images/to-retinol-02.jpg'),(16,'BD001','SA Smoothing Cleanser','Body cleanser with salicylic acid for rough skin.','Body Care','CeraVe',40,22.00,'/images/cerave-sa-cleanser.jpg'),(17,'CL003','Eucerin Eczema Relief Cream Cleanser','Fragrance-free, gentle cleanser formulated with ceramides and colloidal oatmeal for eczema-prone and sensitive skin.','Cleanser','Eucerin',50,14.99,'/images/eucerin-eczema-cleanser.jpg'),(18,'M0003','Aveeno Eczema Therapy Daily Moisturizing Cream','Fragrance-free, steroid-free, eczema-friendly moisturizer with colloidal oatmeal to soothe dry, sensitive skin.','Moisturizer','Aveeno',59,18.99,'/images/aveeno-eczema-cream.jpg'),(19,'SS003','Supergoop! Mineral Mattescreen SPF 40','Fragrance-free, reef-safe, mineral sunscreen with inclusive tinted shades suitable for all skin tones.','Sunscreen','Supergoop!',40,39.00,'/images/supergoop-mineral-mattescreen.jpg'),(20,'CL004','The Body Shop Refillable Aloe Calming Cleanser','Gentle aloe-based cleanser for sensitive skin, available in refillable aluminum packaging for a low-waste option.','Cleanser','The Body Shop',35,22.00,'/images/bodyshop-refill-cleanser.jpg'),(21,'M0004','Ethique The Perfector Solid Face Cream','Plastic-free, fragrance-free solid moisturizer in compostable packaging for dry and sensitive skin.','Moisturizer','Ethique',30,29.00,'/images/ethique-perfector.jpg'),(22,'SR004','Biossance Squalane + Hyaluronic Toning Serum','Hydrating serum in recyclable glass packaging with vegan, fragrance-free formula suitable for sensitive skin.','Serum','Biossance',40,32.00,'/images/biossance-hyaluronic-serum.jpg'),(23,'BD002','Vanicream Gentle Body Wash','Eczema-friendly, fragrance-free, dye-free body wash formulated without harsh ingredients. Dermatologist recommended.','Body Care','Vanicream',45,12.99,'/images/vanicream-bodywash.jpg');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `cardholder_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last4` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exp_month` tinyint NOT NULL,
  `exp_year` smallint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `payment_method_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,2,'phil','Visa','1234',2,2023,'2025-12-02 21:49:47','2025-12-02 21:49:47');
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order`
--

DROP TABLE IF EXISTS `purchase_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `billing_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_street` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_province` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_country` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_zip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_street` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_province` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_country` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_zip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PAID',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `purchase_order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order`
--

LOCK TABLES `purchase_order` WRITE;
/*!40000 ALTER TABLE `purchase_order` DISABLE KEYS */;
INSERT INTO `purchase_order` VALUES (2,2,32.50,'2025-12-01 19:01:59',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PAID'),(3,2,32.50,'2025-12-01 20:54:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PAID'),(4,2,32.50,'2025-12-01 21:04:59',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PAID'),(5,NULL,18.00,'2025-12-02 17:57:16','Cake Pan','pantalone ln','toon','Canada','400120','Cake Pan','pantalone ln','toon','Canada','400120','PAID'),(6,5,78.50,'2025-12-02 18:10:48','Bean Bun','bunny land','bustle','bunty land','2345','bean bun','bunny land','bustle','bunty land','2345','PAID'),(7,NULL,32.50,'2025-12-02 18:13:32','pun ti','ti@gmail.com','llay','count lit','23456','pun ti','ti@gmail.com','llay','count lit','23456','PAID'),(8,NULL,22.00,'2025-12-02 18:18:56','Fan fee','fee@gmail.com','feelun','fefun','123456','fan fee','fee@gmail.com','feelun','fefun','123456','PAID'),(9,NULL,18.00,'2025-12-03 02:47:53','Phil Gale','77 Fear Streat','ON','Canada','M3J1P3','Phil Gale','77 Fear Streat','ON','Canada','M3J1P3','PAID'),(10,NULL,73.50,'2025-12-06 15:12:26','Pill Pants','26 pill street','ON','Canada','M3J1P3','Pants Pit','26 pill street','ON','Canada','M3J1P3','PAID'),(11,NULL,85.39,'2025-12-06 18:00:18','Phil Gale','77 Fear Streat','ON','Canada','M3J1P3','Phil Gale','77 Fear Streat','ON','Canada','M3J1P3','PAID'),(12,7,167.00,'2025-12-06 18:05:50','Mill Mane','Mill street','ON','Canada','452018','Mill Mane','Mill street','ON','Canada','452018','PAID'),(13,NULL,104.50,'2025-12-19 23:59:23','Cake Pan','77 Fear Streat','ON','Canada','M3J1P3','Phil Gale','77 Fear Streat','ON','Canada','M3J1P3','PAID'),(14,8,47.00,'2025-12-20 00:08:34','Cake Pan','5 Observatory Road York University 4700 Keele Street Toronto','Ontario','Canada','M3J1P3','Rebecca John','5 Observatory Road York University 4700 Keele Street Toronto','Ontario','Canada','M3J1P3','PAID'),(15,8,104.50,'2025-12-20 00:09:28','Cake Pan','77 Fear Streat','ON','Canada','M3J1P3','Phil Gale','77 Fear Streat','ON','Canada','M3J1P3','PAID');
/*!40000 ALTER TABLE `purchase_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_item`
--

DROP TABLE IF EXISTS `purchase_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `purchase_order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `purchase_order` (`id`),
  CONSTRAINT `purchase_order_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_item`
--

LOCK TABLES `purchase_order_item` WRITE;
/*!40000 ALTER TABLE `purchase_order_item` DISABLE KEYS */;
INSERT INTO `purchase_order_item` VALUES (2,4,1,1,18.00),(3,4,2,1,14.50),(4,5,1,1,18.00),(5,6,2,1,14.50),(6,6,4,2,32.00),(7,7,1,1,18.00),(8,7,2,1,14.50),(9,8,16,1,22.00),(10,9,1,1,18.00),(11,10,1,1,18.00),(12,10,8,1,13.50),(13,10,13,1,42.00),(14,11,2,1,14.50),(15,11,6,1,9.90),(16,11,13,1,42.00),(17,11,18,1,18.99),(18,12,9,3,52.00),(19,12,11,1,11.00),(20,13,2,1,14.50),(21,13,5,1,9.00),(22,13,9,1,52.00),(23,13,14,1,29.00),(24,14,1,1,18.00),(25,14,2,2,14.50),(26,15,2,1,14.50),(27,15,5,1,9.00),(28,15,9,1,52.00),(29,15,14,1,29.00);
/*!40000 ALTER TABLE `purchase_order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test@example.com','$2b$10$Er5iMw0q1F8cbxZsqwUEQOTQIH2Q.2SUbUeJmSJIHB6MxnJUXPgKi','Admin','User',1,1),(2,'gales@gmail.com','$2b$10$NItsAUiAKEc0ZWkLdz4AqOgaIRrvdfew/2UZrBASCM5OJB6EOY8wC','phill','gales',2,0),(3,'mia@gmail.com','$2b$10$FQClrr3UwkRy0FJeI8Jaa.f3nK40JrexOnuA3b3VXjcJlRvbAoPwG','Mia','Bane',3,0),(4,'doe@gmail.com','$2b$10$txEU3dymOHBmNG2gQj7SWualQtafBssX7up7VHfZG6A/6j7pNlmOm','Jane','dane',4,0),(5,'bun@gmail.com','$2b$10$rNGZNNf.7SJboNdGyczl8OpFXpjKeGct3UWrsrx3Y3ns9c0ek52JS','bean','bag',5,0),(6,'peter@gmail.com','$2b$10$c/c1g6MRj.c7Jm2WwacdVesMfKYjhdEhiAqaoZJ8BiLdgz2YfjoZS','peter','pan',6,0),(7,'Mill@gmail.com','$2b$10$7yI/AYCtO4tXmvFKy.Z8ouobFWHlYXS8k5C6ePHMwf5wom.IO1bqe','Rebecca','John',7,0),(8,'Rebeccasjohn@outlook.com','$2b$10$Nmhgj7sez7SYzS0tFqujPuSUUNFhtoxlg0eM8osicxXoUdZRsBPKa','Reena','John',8,0),(9,'tan@gmail.com','$2b$10$2DRwSZtTWAE9u/VweFeUCuXW7MXCrVGUALiw6LPfrhtRJs.Gbv1gG','pan','tan',9,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'railway'
--

--
-- Dumping routines for database 'railway'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-20  0:29:35
