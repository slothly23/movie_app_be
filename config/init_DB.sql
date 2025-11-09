CREATE DATABASE IF NOT exists movie_app_db;
USE movie_app_db;

CREATE TABLE IF NOT exists movies (
id INT AUTO_INCREMENT PRIMARY KEY,
title varchar(255) NOT NULL,
year INT,
description text,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp ON update current_timestamp
);