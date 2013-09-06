SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `myTaskDB` DEFAULT CHARACTER SET utf8 ;
USE `myTaskDB` ;

-- -----------------------------------------------------
-- Table `myTaskDB`.`user_cookie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`user_cookie` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`user_cookie` (
  `user_id` INT(10) NOT NULL,
  `sid` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `sid` ON `myTaskDB`.`user_cookie` (`sid` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`user` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`user` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `nickName` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `avatar` VARCHAR(60) NULL DEFAULT NULL,
  `salt` VARCHAR(60) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 31
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `email` ON `myTaskDB`.`user` (`email` ASC);

CREATE INDEX `fk_user_user_cookie1_idx` ON `myTaskDB`.`user` (`user_cookie_user_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`team`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`team` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`team` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(90) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `myTaskDB`.`project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`project` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`project` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(90) NOT NULL,
  `description` VARCHAR(300) NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `team_id` INT(10) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `discussionNum` INT(3) NULL DEFAULT '0',
  `todoNum` INT(3) NULL DEFAULT '0',
  `fileNum` INT(3) NULL DEFAULT '0',
  `documentNum` INT(3) NULL DEFAULT '0',
  `repository` INT(1) NULL DEFAULT '0',
  `repositoryName` VARCHAR(180) NULL DEFAULT NULL,
  `color` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 89
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`project` (`own_id` ASC);

CREATE INDEX `fk_project_team1_idx` ON `myTaskDB`.`project` (`team_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`attachment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`attachment` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`attachment` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(60) NULL DEFAULT NULL,
  `name` VARCHAR(60) NULL DEFAULT NULL,
  `own_id` INT(10) NULL DEFAULT NULL,
  `project_id` INT(10) NULL DEFAULT NULL,
  `fileType` VARCHAR(1) NULL DEFAULT NULL,
  `createTime` DATETIME NULL DEFAULT NULL,
  `contentType` VARCHAR(100) NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  `width` INT(5) NULL DEFAULT '0',
  `height` INT(5) NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 78
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_attachment_project1_idx` ON `myTaskDB`.`attachment` (`project_id` ASC);

CREATE INDEX `index3` ON `myTaskDB`.`attachment` (`url` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`message`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`message` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`message` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(90) NOT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `project_id` INT(10) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `team_id` INT(10) NULL DEFAULT NULL,
  `comment_num` INT(5) NULL DEFAULT '0',
  `comment_digest` VARCHAR(300) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`message` (`own_id` ASC);

CREATE INDEX `fk_message_project1_idx` ON `myTaskDB`.`message` (`project_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`comment` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`comment` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `content` TEXT NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `message_id` INT(10) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `team_id` INT(10) NULL DEFAULT NULL,
  `project_id` INT(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`comment` (`own_id` ASC);

CREATE INDEX `fk_comment_message1_idx` ON `myTaskDB`.`comment` (`message_id` ASC);

CREATE INDEX `index4` ON `myTaskDB`.`comment` (`createTime` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`attachment_comment_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`attachment_comment_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`attachment_comment_rel` (
  `attachment_id` INT(10) NOT NULL DEFAULT '0',
  `comment_id` INT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`, `comment_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_attachment_comment_rel_comment1_idx` ON `myTaskDB`.`attachment_comment_rel` (`comment_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`attachment_message_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`attachment_message_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`attachment_message_rel` (
  `attachment_id` INT(10) NOT NULL DEFAULT '0',
  `message_id` INT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`, `message_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_attachment_message_rel_message1_idx` ON `myTaskDB`.`attachment_message_rel` (`message_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`todolist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`todolist` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`todolist` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(300) NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `project_id` INT(10) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `description` VARCHAR(300) NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 80
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`todolist` (`own_id` ASC);

CREATE INDEX `fk_todolist_project1_idx` ON `myTaskDB`.`todolist` (`project_id` ASC);

CREATE INDEX `index4` ON `myTaskDB`.`todolist` (`createTime` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`todoitem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`todoitem` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`todoitem` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(300) NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `todolist_id` INT(10) NOT NULL,
  `worker_id` INT(10) NULL DEFAULT NULL,
  `deadline` TIMESTAMP NULL DEFAULT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `project_id` INT(10) NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  `done` INT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 152
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`todoitem` (`own_id` ASC);

CREATE INDEX `fk_todoitem_todolist1_idx` ON `myTaskDB`.`todoitem` (`todolist_id` ASC);

CREATE INDEX `fk_todoitem_user2_idx` ON `myTaskDB`.`todoitem` (`worker_id` ASC);

CREATE INDEX `index5` ON `myTaskDB`.`todoitem` (`deadline` ASC);

CREATE INDEX `index6` ON `myTaskDB`.`todoitem` (`createTime` ASC);

CREATE INDEX `fk_todoitem_project1_idx` ON `myTaskDB`.`todoitem` (`project_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`todocomment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`todocomment` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`todocomment` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(300) NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `todoitem_id` INT(10) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `team_id` INT(10) NULL DEFAULT NULL,
  `project_id` INT(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 81
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`todocomment` (`own_id` ASC);

CREATE INDEX `fk_todocomment_todoitem1_idx` ON `myTaskDB`.`todocomment` (`todoitem_id` ASC);

CREATE INDEX `index4` ON `myTaskDB`.`todocomment` (`createTime` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`attachment_todocomment_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`attachment_todocomment_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`attachment_todocomment_rel` (
  `attachment_id` INT(10) NOT NULL DEFAULT '0',
  `todoComment_id` INT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`, `todoComment_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_attachment_todocomment_rel_todocomment1_idx` ON `myTaskDB`.`attachment_todocomment_rel` (`todoComment_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`todolistcomment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`todolistcomment` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`todolistcomment` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(300) NULL DEFAULT NULL,
  `own_id` INT(10) NOT NULL,
  `todolist_id` INT(10) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `team_id` INT(10) NULL DEFAULT NULL,
  `project_id` INT(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `author` ON `myTaskDB`.`todolistcomment` (`own_id` ASC);

CREATE INDEX `fk_todolistcomment_todolist1_idx` ON `myTaskDB`.`todolistcomment` (`todolist_id` ASC);

CREATE INDEX `index4` ON `myTaskDB`.`todolistcomment` (`createTime` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`attachment_todolistcomment_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`attachment_todolistcomment_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`attachment_todolistcomment_rel` (
  `attachment_id` INT(10) NOT NULL DEFAULT '0',
  `todolistcomment_id` INT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`, `todolistcomment_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_attachment_todolistcomment_rel_todolistcomment1_idx` ON `myTaskDB`.`attachment_todolistcomment_rel` (`todolistcomment_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`calendar`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`calendar` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`calendar` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(60) NULL DEFAULT NULL,
  `description` VARCHAR(60) NULL DEFAULT NULL,
  `color` VARCHAR(10) NULL DEFAULT NULL,
  `own_id` INT(10) NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  `createTime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_calendar_user1_idx` ON `myTaskDB`.`calendar` (`own_id` ASC);

CREATE INDEX `fk_calendar_team1_idx` ON `myTaskDB`.`calendar` (`team_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`calendar_user_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`calendar_user_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`calendar_user_rel` (
  `calendar_id` INT(10) NOT NULL DEFAULT '0',
  `user_id` INT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`calendar_id`, `user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_calendar_user_rel_user1_idx` ON `myTaskDB`.`calendar_user_rel` (`user_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`inviteuser`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`inviteuser` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`inviteuser` (
  `id` VARCHAR(60) NOT NULL,
  `email` VARCHAR(60) NULL DEFAULT NULL,
  `invite_id` INT(10) NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  `privilege` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_inviteuser_team1_idx` ON `myTaskDB`.`inviteuser` (`team_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`inviteproject`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`inviteproject` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`inviteproject` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `project_id` INT(10) NOT NULL,
  `invite_id` INT(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_inviteproject_inviteuser1_idx` ON `myTaskDB`.`inviteproject` (`invite_id` ASC);

CREATE INDEX `fk_inviteproject_project1_idx` ON `myTaskDB`.`inviteproject` (`project_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`operation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`operation` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`operation` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `own_id` INT(10) NULL DEFAULT NULL,
  `createTime` TIMESTAMP NULL DEFAULT NULL,
  `operation_type` INT(2) NULL DEFAULT NULL,
  `target_type` INT(2) NULL DEFAULT NULL,
  `target_id` INT(10) NULL DEFAULT NULL,
  `title` VARCHAR(100) NULL DEFAULT NULL,
  `digest` TEXT NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  `project_id` INT(10) NULL DEFAULT NULL,
  `url` VARCHAR(60) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 427
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `myTaskDB`.`project_user_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`project_user_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`project_user_rel` (
  `project_id` INT(10) NOT NULL,
  `user_id` INT(10) NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_project_user_rel_project1_idx` ON `myTaskDB`.`project_user_rel` (`project_id` ASC);

CREATE INDEX `fk_project_user_rel_user1_idx` ON `myTaskDB`.`project_user_rel` (`user_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`team_user_rel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`team_user_rel` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`team_user_rel` (
  `team_id` INT(10) NOT NULL,
  `user_id` INT(10) NOT NULL,
  `privilege` INT(2) NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_team_user_rel_user_idx` ON `myTaskDB`.`team_user_rel` (`user_id` ASC);

CREATE INDEX `fk_team_user_rel_team1_idx` ON `myTaskDB`.`team_user_rel` (`team_id` ASC);


-- -----------------------------------------------------
-- Table `myTaskDB`.`event`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myTaskDB`.`event` ;

CREATE TABLE IF NOT EXISTS `myTaskDB`.`event` (
  `id` INT(10) NOT NULL AUTO_INCREMENT primary key,
  `title` VARCHAR(60) NULL DEFAULT NULL,
  `description` VARCHAR(60) NULL DEFAULT NULL,
  `team_id` INT(10) NULL DEFAULT NULL,
  `own_id` INT(10) NULL DEFAULT NULL,
  `project_id` INT(10) NULL DEFAULT NULL,
  `calendar_id` INT(10) NULL DEFAULT NULL,
  `createTime` DATETIME NULL DEFAULT NULL,
  `startTime` TIME NULL DEFAULT NULL,
  `startDate` DATE NULL DEFAULT NULL,
  `endDate` DATE NULL DEFAULT NULL)
ENGINE = InnoDB;

CREATE INDEX `fk_event_calendar1_idx` ON `myTaskDB`.`event` (`calendar_id` ASC);

CREATE INDEX `fk_event_project1_idx` ON `myTaskDB`.`event` (`project_id` ASC);

CREATE INDEX `index3` ON `myTaskDB`.`event` (`startDate` ASC);

CREATE INDEX `index4` ON `myTaskDB`.`event` (`endDate` ASC);

CREATE INDEX `fk_event_user1_idx` ON `myTaskDB`.`event` (`own_id` ASC);



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
