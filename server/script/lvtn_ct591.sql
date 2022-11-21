-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 12, 2022 lúc 01:48 PM
-- Phiên bản máy phục vụ: 10.4.25-MariaDB
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `lvtn_ct591`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_khoa_hoc`
--

CREATE TABLE `chi_tiet_khoa_hoc` (
  `id` int(11) NOT NULL,
  `ctkh_idkh` int(11) NOT NULL,
  `ctkh_userid` int(11) NOT NULL,
  `ctkh_create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cua_hang`
--

CREATE TABLE `cua_hang` (
  `id` int(11) NOT NULL,
  `ch_ten` varchar(255) NOT NULL,
  `ch_email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `cua_hang`
--

INSERT INTO `cua_hang` (`id`, `ch_ten`, `ch_email`) VALUES
(1, 'LearnCode', 'titustran0601@gmail.com');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khoa_hoc`
--

CREATE TABLE `khoa_hoc` (
  `kh_id` int(11) NOT NULL,
  `kh_makh` varchar(20) NOT NULL,
  `kh_ten` varchar(300) NOT NULL,
  `kh_mota` text NOT NULL,
  `kh_code` text DEFAULT NULL,
  `kh_hinhanh` varchar(255) DEFAULT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `kh_create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `khoa_hoc`
--

INSERT INTO `khoa_hoc` (`kh_id`, `kh_makh`, `kh_ten`, `kh_mota`, `kh_code`, `kh_hinhanh`, `active`, `kh_create_at`) VALUES
(1, 'khhtmlcb', 'HTML', '<p>Ngôn ngữ định dạng tạo kiểu trang web</p>', '<!DOCTYPE html>\n<html>\n<title>HTML Tutorial</title>\n<body>\n\n<h1>This is a heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>', NULL, 1, '2022-11-12 04:55:18'),
(2, 'css', 'CSS', '<p>Ngôn ngữ định dạng tạo kiểu trang web</p>', 'body {\n    background-color :lightblue ;\n}\n\nh1 {\n    color :white ;\n    text-aligin :center ;\n}\n\np {\n    font-family :verdana ;\n}', NULL, 1, '2022-11-12 04:55:18'),
(3, 'javascript', 'JavaScript', '<p>Khóa học dành cho các bạn chưa biết gì về javascript</p>', '<button onclick=\"myFunction()\">Click Me!</button>\n\n<script>\nfunction myFunction() {\n  let x = document.getElementById(\"demo\");\n  x.style.fontSize = \"25px\";\n  x.style.color = \"red\";\n}\n</script>', NULL, 1, '2022-11-12 04:55:18'),
(5, 'mysql', 'MYSQL', '<p>Ngôn ngữ truy cập cơ sở dữ liệu</p>', 'SELECT * FROMCustomer\nWHERE Country= \'Mexico\';', NULL, 1, '2022-11-12 04:55:18'),
(6, 'python', 'Python', '<p>Một ngôn ngữ lập trình phổ biến</p>', 'if 5 > 2:\n  print(\"Five is greater than two!\")', NULL, 1, '2022-11-12 04:55:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quyen`
--

CREATE TABLE `quyen` (
  `q_id` int(11) NOT NULL,
  `q_ten` varchar(50) NOT NULL,
  `q_vaitro` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `quyen`
--

INSERT INTO `quyen` (`q_id`, `q_ten`, `q_vaitro`) VALUES
(1, 'USER', 'Người dùng'),
(2, 'ADMIN', 'Người quản lý');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `credential` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 1,
  `verify` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `user_id`, `email`, `fullname`, `credential`, `phone`, `gender`, `birthday`, `role_id`, `verify`, `active`, `create_at`) VALUES
(1, '114872046152355360109', 'viettrung0601@gmail.com', 'Trần Việt Trung', '$2a$08$nP0zspLNwgIFWJD2eUqurOMWJPoGu.EqhGc3ijCbib3MaghEKmeSG', '0794351150', 'male', '2000-01-03', 2, 1, 1, '2022-11-12 04:56:05'),
(2, '114872046152355360109', 'huynhanh2215@gmail.com', 'Huỳnh Kim Ánh', '$2a$08$nP0zspLNwgIFWJD2eUqurOMWJPoGu.EqhGc3ijCbib3MaghEKmeSG', '0793994478', 'female', '2000-10-26', 2, 1, 1, '2022-11-12 11:34:54');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chi_tiet_khoa_hoc`
--
ALTER TABLE `chi_tiet_khoa_hoc`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cua_hang`
--
ALTER TABLE `cua_hang`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `khoa_hoc`
--
ALTER TABLE `khoa_hoc`
  ADD PRIMARY KEY (`kh_id`);

--
-- Chỉ mục cho bảng `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`q_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chi_tiet_khoa_hoc`
--
ALTER TABLE `chi_tiet_khoa_hoc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cua_hang`
--
ALTER TABLE `cua_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `khoa_hoc`
--
ALTER TABLE `khoa_hoc`
  MODIFY `kh_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `quyen`
--
ALTER TABLE `quyen`
  MODIFY `q_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `quyen` (`q_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
