

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cmpe295`
--

-- --------------------------------------------------------

--
-- Table structure for table `EmergencyContacts`
--

CREATE TABLE `EmergencyContacts` (
  `emergency_Id` int(11) NOT NULL,
  `phonenumber` varchar(20) NOT NULL,
  `name` varchar(30) NOT NULL,
  `relation` varchar(20) NOT NULL,
  `user_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `EmergencyContacts`
--

INSERT INTO `EmergencyContacts` (`emergency_Id`, `phonenumber`, `name`, `relation`, `user_Id`) VALUES
(31, 'a', 'da', 'fd', 1),
(32, 'fd', 'dsfd', 'df', 1),
(34, '(402) 942-5827', 'Brett', 'Father', 19),
(35, '(402) 492-8582', 'Jessica', 'Friend', 19),
(36, '(404) 493-4844', 'fuck u', 'Father', 25),
(37, 'gtv', 'bgtv', 'tgv', 25);

-- --------------------------------------------------------

--
-- Table structure for table `Food`
--

CREATE TABLE `Food` (
  `food_name` varchar(20) NOT NULL,
  `time_consumed` varchar(20) NOT NULL,
  `amount` varchar(300) NOT NULL,
  `calories` varchar(300) NOT NULL,
  `fat` varchar(300) NOT NULL,
  `fiber` varchar(300) NOT NULL,
  `carbs` varchar(300) NOT NULL,
  `sodium` varchar(300) NOT NULL,
  `protein` varchar(300) NOT NULL,
  `date` date NOT NULL,
  `user_id` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Food`
--

INSERT INTO `Food` (`food_name`, `time_consumed`, `amount`, `calories`, `fat`, `fiber`, `carbs`, `sodium`, `protein`, `date`, `user_id`) VALUES
('afa', '', '', '300', '', '', '', '', '', '2017-05-07', '25'),
('afaf', '', '', '500', '', '', '', '', '', '2017-05-07', '25'),
('afa', '', '', '1000', '', '', '', '', '', '2017-05-07', '25'),
('cxvxc', '', '', '2344', '', '', '', '', '', '2017-05-08', '25'),
('dsfds', '', '', '1000', '', '', '', '', '', '2017-04-11', '25'),
('dsfds', '', '', '1000', '', '', '', '', '', '2017-04-11', '25'),
('c', 'cx', '', '3000', '', '', '', '', '', '2017-05-08', '25'),
('sd', '', '', '0', '', '', '', '', '', '2017-05-08', '25'),
('tfvtfvt', '', '', '1000', '', '', '', '', '', '2017-05-08', '25'),
('rfeferf', '', '', '1000', '', '', '', '', '', '2017-05-08', '25');

-- --------------------------------------------------------

--
-- Table structure for table `Notifications`
--

CREATE TABLE `Notifications` (
  `notification_Id` int(11) NOT NULL,
  `message` varchar(250) NOT NULL,
  `timestamp` date NOT NULL,
  `status` tinyint(1) NOT NULL,
  `notification_type` int(11) NOT NULL,
  `user_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Reports`
--

CREATE TABLE `Reports` (
  `report_Id` int(11) NOT NULL,
  `report_date` date NOT NULL,
  `filepath` varchar(250) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `type` varchar(250) NOT NULL,
  `user_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_Id` int(11) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(25) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phonenumber` int(11) NOT NULL,
  `height` varchar(11) NOT NULL,
  `weight` float NOT NULL,
  `gender` varchar(11) NOT NULL,
  `accesstoken` varchar(400) ,
  `refreshtoken` varchar(400) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_Id`, `email`, `password`, `firstname`, `lastname`, `phonenumber`, `height`, `weight`, `gender`, `accesstoken`, `refreshtoken`) VALUES
(1, 'billyJarb@gmail.com', 'a', '', '', 2147483647, '5', 180, 'M', '', ''),
(2, 'test@aol.com', 'test', 'test', 'test', 1, '2', 2, 'm', '', ''),
(3, 'test@aol.com', 'test', 'test', 'test', 1, '2', 2, 'm', '', ''),
(4, 'f@aol.com', 'd', 'd', 'd', 0, '0', 0, 'u', '', ''),
(5, 'f@a.oc', 'jof', 'd', 'd', 0, '0', 0, 'u', '', ''),
(6, 'f@a.oc', 'jof', 'd', 'd', 0, '0', 0, 'u', '', ''),
(7, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(8, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(9, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(10, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(11, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(12, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(13, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(14, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(15, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(16, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(17, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(18, 'f@fdj.com', 'df', 'fs', 'fds', 0, '0', 0, 'u', '', ''),
(19, 'abc@aol.com', 'abc', 'testtest', 'test', 0, '5', 120, 'M', '', ''),
(20, 'abc@aol.com', 'abc', 'testtest', 'test', 430, '3443', 3441, 'm', '', ''),
(21, 'abc@aol.com', 'abc', 'testtest', 'test', 430, '3443', 3441, 'm', '', ''),
(22, 'abc@aol.com', 'abc', 'testtest', 'test', 430, '3443', 3441, 'm', '', ''),
(23, 'abc@aol.com', 'abc', 'testtest', 'test', 430, '3443', 3441, 'm', '', ''),
(24, 'dfs@a.com', 'fjs', 'fa', 'dfs', 0, '0', 0, 'u', '', ''),
(25, 'test@gmail.com', 'testtest', 'bob', 'josh', 408, '5ft 6in', 54.8846, 'M', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzU1pXWkciLCJhdWQiOiIyMjg0TFAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd3BybyB3bnV0IHdzbGUgd3dlaSB3c29jIHdhY3Qgd3NldCB3bG9jIiwiZXhwIjoxNDk0MzI5MTgyLCJpYXQiOjE0OTQzMDAzODJ9.bLD5Q_dvVJfO4WyHR5-MuU7qvo8p6LN8WyqDJorW5lU', '960d10776b9dbe3db1d3f8ac44b05f163b47a8ec425841db4da93a2b5f5287d6'),
(26, 'abc@gmail.com', 'abcabc', 'abc', 'def', 408, '5 in 7 ft', 120, 'm', '', ''),
(27, 'helloworld@gmail.com', 'test123', 'test', 'user', 408, '5 ft 9 in', 140, 'm', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `EmergencyContacts`
--
ALTER TABLE `EmergencyContacts`
  ADD PRIMARY KEY (`emergency_Id`,`user_Id`),
  ADD KEY `user_Id` (`user_Id`);

--
-- Indexes for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`notification_Id`,`user_Id`),
  ADD KEY `user_Id` (`user_Id`);

--
-- Indexes for table `Reports`
--
ALTER TABLE `Reports`
  ADD PRIMARY KEY (`report_Id`,`user_Id`),
  ADD KEY `user_Id` (`user_Id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `EmergencyContacts`
--
ALTER TABLE `EmergencyContacts`
  MODIFY `emergency_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `EmergencyContacts`
--
ALTER TABLE `EmergencyContacts`
  ADD CONSTRAINT `emergencycontacts_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `Users` (`user_Id`);

--
-- Constraints for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `Users` (`user_Id`);

--
-- Constraints for table `Reports`
--
ALTER TABLE `Reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `Users` (`user_Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
