CREATE DATABASE  IF NOT EXISTS `sopra_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sopra_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sopra_db
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `implikation`
--

DROP TABLE IF EXISTS `implikation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `implikation` (
  `id` int NOT NULL,
  `bezugsobjekt1_id` int NOT NULL,
  `bezugsobjekt2_id` int NOT NULL,
  `style_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bezugsobjekt1_id` (`bezugsobjekt1_id`),
  KEY `bezugsobjekt2_id` (`bezugsobjekt2_id`),
  KEY `style_id` (`style_id`),
  CONSTRAINT `implikation_ibfk_1` FOREIGN KEY (`bezugsobjekt1_id`) REFERENCES `kleidungstyp` (`id`),
  CONSTRAINT `implikation_ibfk_2` FOREIGN KEY (`bezugsobjekt2_id`) REFERENCES `kleidungstyp` (`id`),
  CONSTRAINT `implikation_ibfk_3` FOREIGN KEY (`style_id`) REFERENCES `style` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `implikation`
--

LOCK TABLES `implikation` WRITE;
/*!40000 ALTER TABLE `implikation` DISABLE KEYS */;
INSERT INTO `implikation` VALUES (1,9,5,1),(2,7,10,3),(3,6,1,2);
/*!40000 ALTER TABLE `implikation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kardinalitaet`
--

DROP TABLE IF EXISTS `kardinalitaet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kardinalitaet` (
  `id` int NOT NULL,
  `min_anzahl` int NOT NULL DEFAULT '0',
  `max_anzahl` int NOT NULL DEFAULT '0',
  `bezugsobjekt_id` int NOT NULL,
  `style_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bezugsobjekt_id` (`bezugsobjekt_id`),
  KEY `style_id` (`style_id`),
  CONSTRAINT `kardinalitaet_ibfk_1` FOREIGN KEY (`bezugsobjekt_id`) REFERENCES `kleidungstyp` (`id`),
  CONSTRAINT `kardinalitaet_ibfk_2` FOREIGN KEY (`style_id`) REFERENCES `style` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kardinalitaet`
--

LOCK TABLES `kardinalitaet` WRITE;
/*!40000 ALTER TABLE `kardinalitaet` DISABLE KEYS */;
INSERT INTO `kardinalitaet` VALUES (1,1,1,5,1),(2,1,1,9,1),(3,1,1,1,2),(4,0,1,6,2),(5,1,1,5,3),(6,1,1,9,3),(7,1,1,1,4),(8,0,1,3,4);
/*!40000 ALTER TABLE `kardinalitaet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kleiderschrank`
--

DROP TABLE IF EXISTS `kleiderschrank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kleiderschrank` (
  `id` int NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `eigentuemer_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `eigentuemer_id` (`eigentuemer_id`),
  CONSTRAINT `kleiderschrank_ibfk_1` FOREIGN KEY (`eigentuemer_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kleiderschrank`
--

LOCK TABLES `kleiderschrank` WRITE;
/*!40000 ALTER TABLE `kleiderschrank` DISABLE KEYS */;
INSERT INTO `kleiderschrank` VALUES (1,'Maximilians Schrank',1),(2,'Erikas Schrank',2);
/*!40000 ALTER TABLE `kleiderschrank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kleidungsstueck`
--

DROP TABLE IF EXISTS `kleidungsstueck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kleidungsstueck` (
  `id` int NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `typ_id` int NOT NULL,
  `kleiderschrank_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `typ_id` (`typ_id`),
  KEY `kleiderschrank_id` (`kleiderschrank_id`),
  CONSTRAINT `kleidungsstueck_ibfk_1` FOREIGN KEY (`typ_id`) REFERENCES `kleidungstyp` (`id`),
  CONSTRAINT `kleidungsstueck_ibfk_2` FOREIGN KEY (`kleiderschrank_id`) REFERENCES `kleiderschrank` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kleidungsstueck`
--

LOCK TABLES `kleidungsstueck` WRITE;
/*!40000 ALTER TABLE `kleidungsstueck` DISABLE KEYS */;
INSERT INTO `kleidungsstueck` VALUES (1,'Weißes Business-Hemd',5,1),(2,'Schwarze Anzughose',9,1),(3,'Blauer Blazer',10,1),(4,'Graues T-Shirt',1,1),(5,'Blaue Jeans',2,1),(6,'Schwarzer Pullover',3,1),(7,'Rotes Kleid',7,2),(8,'Schwarzer Rock',8,2),(9,'Weiße Bluse',5,2),(10,'Rosa T-Shirt',1,2),(11,'Denim Shorts',6,2),(12,'Beiger Blazer',10,2);
/*!40000 ALTER TABLE `kleidungsstueck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kleidungstyp`
--

DROP TABLE IF EXISTS `kleidungstyp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kleidungstyp` (
  `id` int NOT NULL,
  `bezeichnung` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kleidungstyp`
--

LOCK TABLES `kleidungstyp` WRITE;
/*!40000 ALTER TABLE `kleidungstyp` DISABLE KEYS */;
INSERT INTO `kleidungstyp` VALUES (1,'T-Shirt'),(2,'Jeans'),(3,'Pullover'),(4,'Jacke'),(5,'Hemd'),(6,'Shorts'),(7,'Kleid'),(8,'Rock'),(9,'Anzughose'),(10,'Blazer');
/*!40000 ALTER TABLE `kleidungstyp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mutex`
--

DROP TABLE IF EXISTS `mutex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mutex` (
  `id` int NOT NULL,
  `bezugsobjekt1_id` int NOT NULL,
  `bezugsobjekt2_id` int NOT NULL,
  `style_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bezugsobjekt1_id` (`bezugsobjekt1_id`),
  KEY `bezugsobjekt2_id` (`bezugsobjekt2_id`),
  KEY `style_id` (`style_id`),
  CONSTRAINT `mutex_ibfk_1` FOREIGN KEY (`bezugsobjekt1_id`) REFERENCES `kleidungstyp` (`id`),
  CONSTRAINT `mutex_ibfk_2` FOREIGN KEY (`bezugsobjekt2_id`) REFERENCES `kleidungstyp` (`id`),
  CONSTRAINT `mutex_ibfk_3` FOREIGN KEY (`style_id`) REFERENCES `style` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mutex`
--

LOCK TABLES `mutex` WRITE;
/*!40000 ALTER TABLE `mutex` DISABLE KEYS */;
INSERT INTO `mutex` VALUES (1,6,9,1),(2,7,9,3),(3,3,6,4);
/*!40000 ALTER TABLE `mutex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outfit`
--

DROP TABLE IF EXISTS `outfit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outfit` (
  `id` int NOT NULL,
  `style_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `style_id` (`style_id`),
  CONSTRAINT `outfit_ibfk_1` FOREIGN KEY (`style_id`) REFERENCES `style` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outfit`
--

LOCK TABLES `outfit` WRITE;
/*!40000 ALTER TABLE `outfit` DISABLE KEYS */;
INSERT INTO `outfit` VALUES (1,1),(2,2),(3,3),(4,4);
/*!40000 ALTER TABLE `outfit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outfit_kleidungsstueck`
--

DROP TABLE IF EXISTS `outfit_kleidungsstueck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outfit_kleidungsstueck` (
  `outfit_id` int NOT NULL,
  `kleidungsstueck_id` int NOT NULL,
  PRIMARY KEY (`outfit_id`,`kleidungsstueck_id`),
  KEY `kleidungsstueck_id` (`kleidungsstueck_id`),
  CONSTRAINT `outfit_kleidungsstueck_ibfk_1` FOREIGN KEY (`outfit_id`) REFERENCES `outfit` (`id`),
  CONSTRAINT `outfit_kleidungsstueck_ibfk_2` FOREIGN KEY (`kleidungsstueck_id`) REFERENCES `kleidungsstueck` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outfit_kleidungsstueck`
--

LOCK TABLES `outfit_kleidungsstueck` WRITE;
/*!40000 ALTER TABLE `outfit_kleidungsstueck` DISABLE KEYS */;
INSERT INTO `outfit_kleidungsstueck` VALUES (1,1),(1,2),(1,3),(2,4),(4,5),(4,6),(3,7),(4,10),(2,11),(3,12);
/*!40000 ALTER TABLE `outfit_kleidungsstueck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id` int NOT NULL,
  `vorname` varchar(128) NOT NULL DEFAULT '',
  `nachname` varchar(128) NOT NULL DEFAULT '',
  `nickname` varchar(128) NOT NULL DEFAULT '',
  `google_id` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,'Max','Mustermann','maxm','google123'),(2,'Erika','Musterfrau','erikam','google456');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `style`
--

DROP TABLE IF EXISTS `style`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `style` (
  `id` int NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `style`
--

LOCK TABLES `style` WRITE;
/*!40000 ALTER TABLE `style` DISABLE KEYS */;
INSERT INTO `style` VALUES (1,'Business Casual'),(2,'Sportlich'),(3,'Elegant'),(4,'Freizeit');
/*!40000 ALTER TABLE `style` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `style_kleidungstyp`
--

DROP TABLE IF EXISTS `style_kleidungstyp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `style_kleidungstyp` (
  `style_id` int NOT NULL,
  `kleidungstyp_id` int NOT NULL,
  PRIMARY KEY (`style_id`,`kleidungstyp_id`),
  KEY `kleidungstyp_id` (`kleidungstyp_id`),
  CONSTRAINT `style_kleidungstyp_ibfk_1` FOREIGN KEY (`style_id`) REFERENCES `style` (`id`),
  CONSTRAINT `style_kleidungstyp_ibfk_2` FOREIGN KEY (`kleidungstyp_id`) REFERENCES `kleidungstyp` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `style_kleidungstyp`
--

LOCK TABLES `style_kleidungstyp` WRITE;
/*!40000 ALTER TABLE `style_kleidungstyp` DISABLE KEYS */;
INSERT INTO `style_kleidungstyp` VALUES (1,1),(2,1),(4,1),(2,2),(4,2),(4,3),(1,5),(3,5),(2,6),(4,6),(3,7),(3,8),(1,9),(3,9),(1,10),(3,10);
/*!40000 ALTER TABLE `style_kleidungstyp` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-29 12:21:41
