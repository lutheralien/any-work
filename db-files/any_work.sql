-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 13, 2022 at 12:50 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `any_work`
--

-- --------------------------------------------------------

--
-- Table structure for table `photo_library`
--

CREATE TABLE `photo_library` (
  `photo_id` int(11) NOT NULL,
  `images` varchar(255) NOT NULL,
  `user_id` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(200) NOT NULL,
  `user_name` text NOT NULL,
  `password` varchar(200) NOT NULL,
  `user_phone` int(12) NOT NULL,
  `user_phone_a` int(12) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `dob` date DEFAULT NULL,
  `profile_image` varchar(200) NOT NULL,
  `gender` text NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `registration_date` datetime NOT NULL,
  `address` text NOT NULL,
  `district` text NOT NULL,
  `town_city` text NOT NULL,
  `region` varchar(15) NOT NULL,
  `business_name` text NOT NULL,
  `profession` text NOT NULL,
  `groupings` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `password`, `user_phone`, `user_phone_a`, `user_email`, `dob`, `profile_image`, `gender`, `last_login`, `registration_date`, `address`, `district`, `town_city`, `region`, `business_name`, `profession`, `groupings`) VALUES
('4065d2fb-f8fa-4ebc-b3a8-8697b2ef1dbf', 'Canga08', '$2b$08$/IBrew7nmct/4HLwbX1uL.HdujG6DoCACGYubv6A0L1P0nBVTu62y', 548446233, 0, 'darlinchipz@gmail.com', NULL, 'blob9dd2ebe8-b3b6-4d01-ae40-6321a59b3d11', '', '2022-09-12 07:13:02', '2022-09-12 07:12:39', '', '', '', '', '', '', ''),
('f804883c-72d5-4afd-922d-956692effe86', 'Kwame Joe', '$2b$08$VHSAF5WYWFnHCt7EeAc.kOBXYXsUEuPdlzz/pqHbyUD4YupGlzEri', 209465756, 209465756, 'opisi9798@nzaif.com', '2022-09-08', '1ae6be44-a835-448a-84e4-2eb160814cf5FB_IMG_16514900438659846.jpg', 'Female', '2022-09-12 06:27:23', '2022-09-06 05:01:07', 'safari junction', 'Pru District', 'Nkoranza', 'Ahafo', 'Nyame Nti Painters', 'painter', 'individual');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `photo_library`
--
ALTER TABLE `photo_library`
  ADD PRIMARY KEY (`photo_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `photo_library`
--
ALTER TABLE `photo_library`
  MODIFY `photo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `photo_library`
--
ALTER TABLE `photo_library`
  ADD CONSTRAINT `photo_library_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
