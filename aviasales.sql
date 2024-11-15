-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Ноя 15 2024 г., 20:48
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `aviasales`
--

DELIMITER $$
--
-- Процедуры
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_ticket` (IN `_departure_time` DATETIME, IN `_arrival_time` DATETIME, IN `_price` DECIMAL, IN `_departure_city_id` INT, IN `_arrival_city_id` INT, IN `_airline_id` INT)  MODIFIES SQL DATA INSERT INTO tickets(departure_time, arrival_time, price, departure_city_id, arrival_city_id, airline_id)
VALUES (_departure_time, _arrival_time, _price, _departure_city_id, _arrival_city_id, _airline_id)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `airlines`
--

CREATE TABLE `airlines` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `airlines`
--

INSERT INTO `airlines` (`id`, `name`) VALUES
(2, 'Белавиа'),
(4, 'Победа'),
(10, 'Игра'),
(11, 'кин дза дза');

-- --------------------------------------------------------

--
-- Структура таблицы `cities`
--

CREATE TABLE `cities` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `cities`
--

INSERT INTO `cities` (`id`, `name`) VALUES
(5, 'Берлин'),
(16, 'вапва'),
(8, 'Варшава'),
(7, 'Вашингтон'),
(17, 'Краков'),
(6, 'Мадрид'),
(1, 'Минск'),
(2, 'Москва'),
(3, 'Париж'),
(10, 'Пекин'),
(18, 'Рофланч');

-- --------------------------------------------------------

--
-- Структура таблицы `dispatchers`
--

CREATE TABLE `dispatchers` (
  `id` int(11) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `airline_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `dispatchers`
--

INSERT INTO `dispatchers` (`id`, `surname`, `firstname`, `middlename`, `user_id`, `airline_id`) VALUES
(1, 'Титович', 'Андрей', 'Петрович', 7, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `dispatcher_requests`
--

CREATE TABLE `dispatcher_requests` (
  `id` int(11) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `status` enum('approved','denied','pending') NOT NULL,
  `user_id` int(11) NOT NULL,
  `airline_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `dispatcher_requests`
--

INSERT INTO `dispatcher_requests` (`id`, `surname`, `firstname`, `middlename`, `status`, `user_id`, `airline_id`) VALUES
(1, 'Титович', 'Андрей', 'Петрович', 'approved', 7, 2);

--
-- Триггеры `dispatcher_requests`
--
DELIMITER $$
CREATE TRIGGER `after_approved_request` AFTER UPDATE ON `dispatcher_requests` FOR EACH ROW IF NEW.status = 'approved' THEN
	INSERT INTO dispatchers(surname, firstname, middlename, user_id, airline_id)
    VALUES (NEW.surname, NEW.firstname, NEW.middlename, NEW.user_id, NEW.airline_id);
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `status` enum('approved','denied','pending') NOT NULL,
  `user_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `firstname`, `surname`, `middlename`, `status`, `user_id`, `ticket_id`) VALUES
(1, 'Герман', 'Сухой', 'Андреевич', 'approved', 2, 6),
(2, 'Владислав', 'Павличук', 'Владимирович', 'denied', 2, 10),
(3, 'Герман', 'Сухой', 'Андреевич', 'pending', 2, 11),
(4, 'Алексей', 'Сивец', 'Игорьевич', 'pending', 7, 10);

-- --------------------------------------------------------

--
-- Структура таблицы `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `departure_city_id` int(11) NOT NULL,
  `arrival_city_id` int(11) NOT NULL,
  `airline_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `tickets`
--

INSERT INTO `tickets` (`id`, `departure_time`, `arrival_time`, `price`, `departure_city_id`, `arrival_city_id`, `airline_id`) VALUES
(1, '2024-10-23 12:16:00', '2024-10-24 01:09:00', 1200, 1, 8, 2),
(2, '2024-10-30 13:00:00', '2024-10-30 15:55:00', 255, 1, 2, 2),
(3, '2024-10-21 00:25:00', '2024-10-21 14:08:00', 980, 2, 10, 4),
(6, '2024-11-17 10:11:00', '2024-11-17 17:43:00', 501, 1, 6, 2),
(7, '9999-09-08 11:01:00', '9999-09-09 09:09:00', 33333333, 5, 8, 2),
(8, '3333-11-11 03:33:00', '9999-09-09 09:09:00', 666, 5, 8, 2),
(9, '2025-02-22 04:33:00', '2025-03-23 05:55:00', 40, 16, 5, 2),
(10, '2024-12-08 14:07:00', '2024-12-08 16:08:00', 350, 1, 2, 2),
(11, '2024-12-12 14:07:00', '2024-12-17 19:09:00', 100, 5, 7, 4),
(12, '2222-09-09 11:13:00', '3293-03-09 04:24:00', 666, 16, 5, 10),
(13, '2024-12-14 19:00:00', '2024-12-16 11:11:00', 150, 8, 7, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'cool_admin', 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'admin'),
(2, 'roflik', 'roflik@gmail.com', '202cb962ac59075b964b07152d234b70', 'user'),
(7, 'flylover', 'flylover@gmail.com', '698d51a19d8a121ce581499d7b701668', 'user');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `airlines`
--
ALTER TABLE `airlines`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Индексы таблицы `dispatchers`
--
ALTER TABLE `dispatchers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `airline_id` (`airline_id`);

--
-- Индексы таблицы `dispatcher_requests`
--
ALTER TABLE `dispatcher_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `airline_id` (`airline_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `orders_ibfk_1` (`user_id`);

--
-- Индексы таблицы `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departure_city_id` (`departure_city_id`),
  ADD KEY `arrival_city_id` (`arrival_city_id`),
  ADD KEY `airline_id` (`airline_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `airlines`
--
ALTER TABLE `airlines`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `dispatchers`
--
ALTER TABLE `dispatchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `dispatcher_requests`
--
ALTER TABLE `dispatcher_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `dispatchers`
--
ALTER TABLE `dispatchers`
  ADD CONSTRAINT `dispatchers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dispatchers_ibfk_2` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `dispatcher_requests`
--
ALTER TABLE `dispatcher_requests`
  ADD CONSTRAINT `dispatcher_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dispatcher_requests_ibfk_2` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`departure_city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`arrival_city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
