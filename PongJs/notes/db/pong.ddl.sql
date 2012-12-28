SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `pong` ;
CREATE SCHEMA IF NOT EXISTS `pong` DEFAULT CHARACTER SET latin1 ;
USE `pong` ;

-- -----------------------------------------------------
-- Table `pong`.`PlayerStateDef`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pong`.`PlayerStateDef` ;

CREATE  TABLE IF NOT EXISTS `pong`.`PlayerStateDef` (
  `playerStateDefId` INT(11) NOT NULL AUTO_INCREMENT ,
  `description` VARCHAR(255) NOT NULL ,
  PRIMARY KEY (`playerStateDefId`) )
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = latin1;

CREATE UNIQUE INDEX `description_UNIQUE` ON `pong`.`PlayerStateDef` (`description` ASC) ;


-- -----------------------------------------------------
-- Table `pong`.`Player`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pong`.`Player` ;

CREATE  TABLE IF NOT EXISTS `pong`.`Player` (
  `userId` VARCHAR(32) NOT NULL ,
  `firstName` VARCHAR(45) NOT NULL ,
  `lastName` VARCHAR(45) NOT NULL ,
  `createDt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `lastUpdateDt` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00' ,
  `state` INT(11) NOT NULL ,
  PRIMARY KEY (`userId`) ,
  CONSTRAINT `fk_player_state`
    FOREIGN KEY (`state` )
    REFERENCES `pong`.`PlayerStateDef` (`playerStateDefId` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_player_state_idx` ON `pong`.`Player` (`state` ASC) ;


-- -----------------------------------------------------
-- Table `pong`.`GamePlayer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pong`.`GamePlayer` ;

CREATE  TABLE IF NOT EXISTS `pong`.`GamePlayer` (
  `gameId` INT(11) NOT NULL ,
  `playerId` VARCHAR(32) NOT NULL ,
  `score` INT(11) NOT NULL ,
  `paddlePos` FLOAT NOT NULL ,
  `lastUpdateDt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  PRIMARY KEY (`gameId`, `playerId`) ,
  CONSTRAINT `fk_gamePlayer_gameId`
    FOREIGN KEY (`gameId` )
    REFERENCES `pong`.`Game` (`idGame` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_gamePlayer_playerId`
    FOREIGN KEY (`playerId` )
    REFERENCES `pong`.`Player` (`userId` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_game_gameId_idx` ON `pong`.`GamePlayer` (`gameId` ASC) ;

CREATE INDEX `fk__idx` ON `pong`.`GamePlayer` (`playerId` ASC) ;


-- -----------------------------------------------------
-- Table `pong`.`GameStateDef`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pong`.`GameStateDef` ;

CREATE  TABLE IF NOT EXISTS `pong`.`GameStateDef` (
  `idGameStateDef` INT(11) NOT NULL AUTO_INCREMENT ,
  `description` VARCHAR(255) NOT NULL ,
  PRIMARY KEY (`idGameStateDef`) )
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = latin1;

CREATE UNIQUE INDEX `description_UNIQUE` ON `pong`.`GameStateDef` (`description` ASC) ;


-- -----------------------------------------------------
-- Table `pong`.`Game`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pong`.`Game` ;

CREATE  TABLE IF NOT EXISTS `pong`.`Game` (
  `idGame` INT(11) NOT NULL AUTO_INCREMENT ,
  `firstGamePlayerId` VARCHAR(32) NOT NULL ,
  `secondGamePlayerId` VARCHAR(32) NOT NULL ,
  `state` INT(11) NOT NULL ,
  `ballPosX` FLOAT NOT NULL ,
  `ballPosY` FLOAT NOT NULL ,
  `ballVelocityX` FLOAT NOT NULL ,
  `ballVelocityY` FLOAT NOT NULL ,
  `createDt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `lastUpdateDt` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00' ,
  PRIMARY KEY (`idGame`) ,
  CONSTRAINT `fk_game_firstGamePlayerId`
    FOREIGN KEY (`firstGamePlayerId` )
    REFERENCES `pong`.`GamePlayer` (`playerId` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_secondGamePlayerId`
    FOREIGN KEY (`secondGamePlayerId` )
    REFERENCES `pong`.`GamePlayer` (`playerId` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_state`
    FOREIGN KEY (`state` )
    REFERENCES `pong`.`GameStateDef` (`idGameStateDef` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_game_firstGamePlayerId_idx` ON `pong`.`Game` (`firstGamePlayerId` ASC) ;

CREATE INDEX `fk_game_secondGamePlayerId_idx` ON `pong`.`Game` (`secondGamePlayerId` ASC) ;

CREATE INDEX `fk_game_state_idx` ON `pong`.`Game` (`state` ASC) ;


-- -----------------------------------------------------
-- Table `pong`.`GameRequest`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pong`.`GameRequest` ;

CREATE  TABLE IF NOT EXISTS `pong`.`GameRequest` (
  `idGameRequest` INT(11) NOT NULL AUTO_INCREMENT ,
  `initiatorId` VARCHAR(32) NOT NULL ,
  `requestedId` VARCHAR(32) NULL DEFAULT NULL ,
  `accepted` INT(11) NOT NULL DEFAULT '0' ,
  `createDt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `lastUpdateDt` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00' ,
  PRIMARY KEY (`idGameRequest`) ,
  CONSTRAINT `fk_gameRequest_initiatorId`
    FOREIGN KEY (`initiatorId` )
    REFERENCES `pong`.`Player` (`userId` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_gameRequest_requestedId`
    FOREIGN KEY (`requestedId` )
    REFERENCES `pong`.`Player` (`userId` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_playerStateDef_initiatorId_idx` ON `pong`.`GameRequest` (`initiatorId` ASC) ;

CREATE INDEX `fk_playerState_idx` ON `pong`.`GameRequest` (`requestedId` ASC) ;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
