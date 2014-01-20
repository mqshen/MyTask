CREATE DATABASE  IF NOT EXISTS `myTaskDB` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `myTaskDB`;
-- MySQL dump 10.13  Distrib 5.6.11, for osx10.6 (i386)
--
-- Host: 127.0.0.1    Database: myTaskDB
-- ------------------------------------------------------
-- Server version   5.6.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `maxAmt` decimal(19,2) DEFAULT NULL,
  `maxInterest` decimal(19,2) DEFAULT NULL,
  `maxPeriod` int(11) NOT NULL,
  `minAmt` decimal(19,2) DEFAULT NULL,
  `minInterest` decimal(19,2) DEFAULT NULL,
  `minPeriod` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `platformId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachment`
--

DROP TABLE IF EXISTS `attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `url` varchar(60) DEFAULT NULL,
  `name` varchar(60) DEFAULT NULL,
  `own_id` int(10) DEFAULT NULL,
  `project_id` int(10) DEFAULT NULL,
  `fileType` varchar(1) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `contentType` varchar(100) DEFAULT NULL,
  `team_id` int(10) DEFAULT NULL,
  `width` int(5) DEFAULT '0',
  `height` int(5) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_attachment_project1_idx` (`project_id`),
  KEY `index3` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachment_comment_rel`
--

DROP TABLE IF EXISTS `attachment_comment_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment_comment_rel` (
  `attachment_id` int(10) NOT NULL DEFAULT '0',
  `comment_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`,`comment_id`),
  KEY `fk_attachment_comment_rel_comment1_idx` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachment_message_rel`
--

DROP TABLE IF EXISTS `attachment_message_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment_message_rel` (
  `attachment_id` int(10) NOT NULL DEFAULT '0',
  `message_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`,`message_id`),
  KEY `fk_attachment_message_rel_message1_idx` (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachment_todocomment_rel`
--

DROP TABLE IF EXISTS `attachment_todocomment_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment_todocomment_rel` (
  `attachment_id` int(10) NOT NULL DEFAULT '0',
  `todoComment_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`,`todoComment_id`),
  KEY `fk_attachment_todocomment_rel_todocomment1_idx` (`todoComment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachment_todolistcomment_rel`
--

DROP TABLE IF EXISTS `attachment_todolistcomment_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment_todolistcomment_rel` (
  `attachment_id` int(10) NOT NULL DEFAULT '0',
  `todolistcomment_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`,`todolistcomment_id`),
  KEY `fk_attachment_todolistcomment_rel_todolistcomment1_idx` (`todolistcomment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) DEFAULT NULL,
  `description` varchar(60) DEFAULT NULL,
  `color` varchar(10) DEFAULT NULL,
  `own_id` int(10) DEFAULT NULL,
  `team_id` int(10) DEFAULT NULL,
  `createTime` datetime ,
  PRIMARY KEY (`id`),
  KEY `fk_calendar_user1_idx` (`own_id`),
  KEY `fk_calendar_team1_idx` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calendar_user_rel`
--

DROP TABLE IF EXISTS `calendar_user_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_user_rel` (
  `calendar_id` int(10) NOT NULL DEFAULT '0',
  `user_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`calendar_id`,`user_id`),
  KEY `fk_calendar_user_rel_user1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` text,
  `own_id` int(10) NOT NULL,
  `message_id` int(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `team_id` int(10) DEFAULT NULL,
  `project_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_comment_message1_idx` (`message_id`),
  KEY `index4` (`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) DEFAULT NULL,
  `description` varchar(60) DEFAULT NULL,
  `team_id` int(10) DEFAULT NULL,
  `own_id` int(10) DEFAULT NULL,
  `project_id` int(10) DEFAULT NULL,
  `calendar_id` int(10) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_calendar1_idx` (`calendar_id`),
  KEY `fk_event_project1_idx` (`project_id`),
  KEY `index3` (`startDate`),
  KEY `index4` (`endDate`),
  KEY `fk_event_user1_idx` (`own_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inviteproject`
--

DROP TABLE IF EXISTS `inviteproject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inviteproject` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `project_id` int(10) NOT NULL,
  `invite_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_inviteproject_inviteuser1_idx` (`invite_id`),
  KEY `fk_inviteproject_project1_idx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inviteuser`
--

DROP TABLE IF EXISTS `inviteuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inviteuser` (
  `id` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `invite_id` int(10) DEFAULT NULL,
  `team_id` int(10) DEFAULT NULL,
  `privilege` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_inviteuser_team1_idx` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(90) NOT NULL,
  `content` text,
  `own_id` int(10) NOT NULL,
  `project_id` int(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `team_id` int(10) DEFAULT NULL,
  `comment_num` int(5) DEFAULT '0',
  `comment_digest` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_message_project1_idx` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message_data`
--

DROP TABLE IF EXISTS `message_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_data` (
  `project_id` int(10) NOT NULL DEFAULT '0',
  `add_date` date NOT NULL DEFAULT '0000-00-00',
  `total_number` int(5) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`add_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message_user_data`
--

DROP TABLE IF EXISTS `message_user_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_user_data` (
  `project_id` int(10) NOT NULL DEFAULT '0',
  `user_id` int(10) NOT NULL DEFAULT '0',
  `add_date` date NOT NULL DEFAULT '0000-00-00',
  `total_number` int(5) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`user_id`,`add_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message_week_data`
--

DROP TABLE IF EXISTS `message_week_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_week_data` (
  `project_id` int(10) NOT NULL DEFAULT '0',
  `add_weekday` int(1) NOT NULL DEFAULT '0',
  `total_number` int(5) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`add_weekday`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operation`
--

DROP TABLE IF EXISTS `operation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operation` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `own_id` int(10) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `operation_type` int(2) DEFAULT NULL,
  `target_type` int(2) DEFAULT NULL,
  `target_id` int(10) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `digest` text,
  `team_id` int(10) DEFAULT NULL,
  `project_id` int(10) DEFAULT NULL,
  `url` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(90) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `own_id` int(10) NOT NULL,
  `team_id` int(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `discussionNum` int(3) DEFAULT '0',
  `todoNum` int(3) DEFAULT '0',
  `fileNum` int(3) DEFAULT '0',
  `documentNum` int(3) DEFAULT '0',
  `repository` int(1) DEFAULT '0',
  `repositoryName` varchar(180) DEFAULT NULL,
  `color` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_project_team1_idx` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project_user_rel`
--

DROP TABLE IF EXISTS `project_user_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_user_rel` (
  `project_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  KEY `fk_project_user_rel_project1_idx` (`project_id`),
  KEY `fk_project_user_rel_user1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(90) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_user_rel`
--

DROP TABLE IF EXISTS `team_user_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_user_rel` (
  `team_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `privilege` int(2) DEFAULT NULL,
  KEY `fk_team_user_rel_user_idx` (`user_id`),
  KEY `fk_team_user_rel_team1_idx` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `todo_data`
--

DROP TABLE IF EXISTS `todo_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todo_data` (
  `project_id` int(10) NOT NULL DEFAULT '0',
  `add_date` date NOT NULL DEFAULT '0000-00-00',
  `total_number` int(5) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`add_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `todo_user_data`
--

DROP TABLE IF EXISTS `todo_user_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todo_user_data` (
  `project_id` int(10) NOT NULL DEFAULT '0',
  `user_id` int(10) NOT NULL DEFAULT '0',
  `add_date` date NOT NULL DEFAULT '0000-00-00',
  `total_number` int(5) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`user_id`,`add_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `todocomment`
--

DROP TABLE IF EXISTS `todocomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todocomment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(300) DEFAULT NULL,
  `own_id` int(10) NOT NULL,
  `todoitem_id` int(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `team_id` int(10) DEFAULT NULL,
  `project_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_todocomment_todoitem1_idx` (`todoitem_id`),
  KEY `index4` (`createTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `todoitem`
--

DROP TABLE IF EXISTS `todoitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todoitem` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `description` varchar(300) DEFAULT NULL,
  `own_id` int(10) NOT NULL,
  `todolist_id` int(10) NOT NULL,
  `worker_id` int(10) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `project_id` int(10) DEFAULT NULL,
  `team_id` int(10) DEFAULT NULL,
  `done` int(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_todoitem_todolist1_idx` (`todolist_id`),
  KEY `fk_todoitem_user2_idx` (`worker_id`),
  KEY `index5` (`deadline`),
  KEY `index6` (`createTime`),
  KEY `fk_todoitem_project1_idx` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `todolist`
--

DROP TABLE IF EXISTS `todolist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todolist` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `own_id` int(10) NOT NULL,
  `project_id` int(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(300) DEFAULT NULL,
  `team_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_todolist_project1_idx` (`project_id`),
  KEY `index4` (`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `todolistcomment`
--

DROP TABLE IF EXISTS `todolistcomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todolistcomment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(300) DEFAULT NULL,
  `own_id` int(10) NOT NULL,
  `todolist_id` int(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `team_id` int(10) DEFAULT NULL,
  `project_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`own_id`),
  KEY `fk_todolistcomment_todolist1_idx` (`todolist_id`),
  KEY `index4` (`createTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nickName` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `avatar` varchar(60) DEFAULT NULL,
  `salt` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_cookie`
--

DROP TABLE IF EXISTS `user_cookie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_cookie` (
  `user_id` int(10) NOT NULL,
  `sid` varchar(40) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `sid` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-01-19 20:55:37

