-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: May 24, 2025 at 10:32 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_gym_tracker2`
--

-- --------------------------------------------------------

--
-- Table structure for table `exercise`
--

CREATE TABLE `exercise` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `muscle_group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercise`
--

INSERT INTO `exercise` (`id`, `name`, `muscle_group_id`) VALUES
(1, 'Chest 1', 1),
(4, 'Chest 2', 1),
(6, 'Back 1', 2),
(7, 'Back 2', 2),
(8, 'No Muscle', NULL),
(10, 'Leg 1', 3),
(11, 'Leg 2', 3),
(12, 'Shoulder 1', 4),
(13, 'Shoulder 2', NULL),
(16, 'Stretch', NULL),
(18, 'Jumping', NULL),
(19, 'Leg 3', 3),
(20, 'Chest 3', 1),
(21, 'Running', 12),
(22, 'Jumping', NULL),
(23, 'Rope Jumping', 12),
(24, 'Swimming', 12),
(25, 'Jumping', 12);

-- --------------------------------------------------------

--
-- Table structure for table `muscle_group`
--

CREATE TABLE `muscle_group` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `muscle_group`
--

INSERT INTO `muscle_group` (`id`, `name`) VALUES
(1, 'Chest'),
(2, 'Back'),
(3, 'Legs'),
(4, 'Shoulders'),
(10, 'Core'),
(12, 'Cardio');

-- --------------------------------------------------------

--
-- Table structure for table `working_set`
--

CREATE TABLE `working_set` (
  `id` int(11) NOT NULL,
  `exercise_id` int(11) DEFAULT NULL,
  `repetitions` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `workout_id` int(11) NOT NULL,
  `comment` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `working_set`
--

INSERT INTO `working_set` (`id`, `exercise_id`, `repetitions`, `weight`, `workout_id`, `comment`) VALUES
(20, NULL, 15, 110, 13, 'Abs'),
(21, NULL, NULL, 10, 13, 'bad form'),
(22, NULL, NULL, NULL, 13, 'Cardio 30 mins'),
(24, NULL, NULL, NULL, 15, 'Test'),
(25, NULL, NULL, NULL, 13, 'HARDaaaaaaaaaaaaaaaa'),
(26, NULL, 2000, 2000000000, 13, 'Test'),
(27, 4, 20, 10, 19, 'warm up'),
(28, 4, 20, 20, 19, NULL),
(29, 4, 20, 30, 19, NULL),
(30, 4, 20, 40, 19, NULL),
(31, 20, 30, 10, 19, 'warm up'),
(32, 20, 10, 20, 19, NULL),
(33, 20, 10, 10, 19, NULL),
(34, 20, 10, 10, 19, NULL),
(38, 1, 10, 10, 19, NULL),
(39, 1, 10, 20, 19, NULL),
(40, 1, 20, 20, 19, 'hard'),
(41, 1, 10, 20, 19, ''),
(42, 1, 10, 30, 19, NULL),
(43, NULL, 0, 0, 19, '10 mins'),
(44, 6, 0, 0, 19, ''),
(45, 6, 0, 0, 19, NULL),
(46, 6, 0, 0, 19, 'Test'),
(47, 6, 5, 0, 19, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workout`
--

CREATE TABLE `workout` (
  `id` int(11) NOT NULL,
  `date_added` datetime DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workout`
--

INSERT INTO `workout` (`id`, `date_added`, `description`) VALUES
(13, '2025-05-23 14:27:09', 'Leg day 3'),
(14, '2025-05-23 14:27:22', 'Max Out Legs'),
(15, '2025-05-23 16:04:14', 'Leg day 4'),
(17, '2025-05-24 10:04:09', 'Leg Day 5'),
(18, '2025-05-24 10:19:00', 'Leg Day 6'),
(19, '2025-05-24 10:19:11', 'Leg Day 7');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exercise`
--
ALTER TABLE `exercise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `muscle_group_FK` (`muscle_group_id`);

--
-- Indexes for table `muscle_group`
--
ALTER TABLE `muscle_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `working_set`
--
ALTER TABLE `working_set`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exercise_FK` (`exercise_id`),
  ADD KEY `workout_FK` (`workout_id`) USING BTREE;

--
-- Indexes for table `workout`
--
ALTER TABLE `workout`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exercise`
--
ALTER TABLE `exercise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `muscle_group`
--
ALTER TABLE `muscle_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `working_set`
--
ALTER TABLE `working_set`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `workout`
--
ALTER TABLE `workout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exercise`
--
ALTER TABLE `exercise`
  ADD CONSTRAINT `muscle_group_FK` FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `working_set`
--
ALTER TABLE `working_set`
  ADD CONSTRAINT `exercise_FK` FOREIGN KEY (`exercise_id`) REFERENCES `exercise` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `workout_FK` FOREIGN KEY (`workout_id`) REFERENCES `workout` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
