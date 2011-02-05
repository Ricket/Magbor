/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES latin1 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='SYSTEM' */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE */;
/*!40101 SET SQL_MODE='' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES */;
/*!40103 SET SQL_NOTES='ON' */;


# Host: localhost    Database: Magbor
# ------------------------------------------------------
# Server version 5.0.20-community

USE `Magbor`;

#
# Table structure for table actions
#

DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `actionid` tinyint(3) unsigned NOT NULL default '0',
  `playerid` smallint(6) NOT NULL default '0',
  `time` datetime NOT NULL default '0000-00-00 00:00:00',
  `map` tinyint(3) unsigned NOT NULL default '0',
  `xpos` smallint(5) unsigned NOT NULL default '65535',
  `ypos` smallint(5) unsigned NOT NULL default '65535',
  `parameters` varchar(255) collate latin1_general_ci NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table actions
#


#
# Table structure for table items
#

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `typeid` smallint(5) unsigned NOT NULL,
  `map` tinyint(3) unsigned NOT NULL default '0',
  `xpos` smallint(5) unsigned NOT NULL default '0',
  `ypos` smallint(5) unsigned NOT NULL default '0',
  `playerid` smallint(5) unsigned NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table items
#

INSERT INTO `items` VALUES (1,0,0,0,0,1);
INSERT INTO `items` VALUES (2,0,0,0,2,0);
INSERT INTO `items` VALUES (3,0,0,1,0,0);

#
# Table structure for table maps
#

DROP TABLE IF EXISTS `maps`;
CREATE TABLE `maps` (
  `id` tinyint(3) unsigned NOT NULL default '0',
  `filename` varchar(35) collate latin1_general_ci NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table maps
#

INSERT INTO `maps` VALUES (0,'default');
INSERT INTO `maps` VALUES (1,'RiverAndLake');

#
# Table structure for table sessions
#

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `sesskey` varchar(32) collate latin1_general_ci NOT NULL default '',
  `expiry` int(11) unsigned NOT NULL default '0',
  `value` mediumtext collate latin1_general_ci NOT NULL,
  PRIMARY KEY  (`sesskey`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table sessions
#


#
# Table structure for table users
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `username` varchar(20) collate latin1_general_ci NOT NULL default '',
  `password` varchar(32) collate latin1_general_ci NOT NULL,
  `admin` tinyint(1) NOT NULL default '0',
  `lastseen` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `loggedin` tinyint(1) NOT NULL default '0',
  `map` tinyint(3) unsigned NOT NULL default '0',
  `xpos` smallint(5) unsigned NOT NULL default '0',
  `ypos` smallint(5) unsigned NOT NULL default '0',
  `headcolor` mediumint(8) unsigned NOT NULL default '0',
  `bodycolor` mediumint(8) unsigned NOT NULL default '0',
  `legscolor` mediumint(8) unsigned NOT NULL default '0',
  `outlinecolor` mediumint(8) unsigned NOT NULL default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table users
#

INSERT INTO `users` VALUES (1,'Ricky28269',MD5('Ricky'),1,NOW() - INTERVAL 30 SECOND,0,0,9,11,16724787,10092441,26316,0);
INSERT INTO `users` VALUES (2,'test',MD5('test'),0,NOW() - INTERVAL 30 SECOND,0,0,5,12,16777215,16777215,16777215,0);
INSERT INTO `users` VALUES (3,'test2',MD5('test2'),0,NOW() - INTERVAL 30 SECOND,0,0,3,2,16777215,16777215,16777215,0);
INSERT INTO `users` VALUES (4,'test3',MD5('test3'),0,NOW() - INTERVAL 30 SECOND,0,0,0,0,16777215,16777215,16777215,0);
INSERT INTO `users` VALUES (5,'test4',MD5('test4'),0,NOW() - INTERVAL 30 SECOND,0,0,3,3,16777215,16777215,16777215,0);
INSERT INTO `users` VALUES (6,'test5',MD5('test5'),0,NOW() - INTERVAL 30 SECOND,0,0,2,2,16777215,16777215,16777215,0);
INSERT INTO `users` VALUES (7,'test6',MD5('test6'),0,NOW() - INTERVAL 30 SECOND,0,0,0,0,16777215,16777215,16777215,0);

#
# Table structure for table itemtypes
#

DROP TABLE IF EXISTS `itemtypes`;
CREATE TABLE `itemtypes` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `name` varchar(40) collate latin1_general_ci NOT NULL,
  `description` varchar(255) collate latin1_general_ci NOT NULL,
  `droppable` tinyint(1) NOT NULL default '1',
  `equippable` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table itemtypes
#

INSERT INTO `itemtypes` VALUES (1,'Devil Suit','Devil suit, complete with horns and tail.',1,1);

#
# Table structure for table public_chat
#

DROP TABLE IF EXISTS `public_chat`;
CREATE TABLE `public_chat` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `user` varchar(20) collate latin1_general_ci NOT NULL default '',
  `time` datetime NOT NULL default '0000-00-00 00:00:00',
  `map` tinyint(3) unsigned NOT NULL default '0',
  `message` varchar(255) collate latin1_general_ci NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

#
# Dumping data for table public_chat
#


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
