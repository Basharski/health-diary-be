
-- ==========================================
-- 1. DATABASE CREATION
-- ==========================================
DROP DATABASE IF EXISTS HealthDiary;
CREATE DATABASE HealthDiary;
USE HealthDiary;

-- ==========================================
-- 2. CREATE TABLES (Design & Data Types)
-- ==========================================

-- Table: Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_level VARCHAR(10) DEFAULT 'regular'
);

-- Table: DiaryEntries
CREATE TABLE DiaryEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    entry_date DATE NOT NULL,
    mood VARCHAR(50),
    weight DECIMAL(5,2),
    sleep_hours INT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Table: Workouts (NEW TABLE)
CREATE TABLE Workouts (
    workout_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    workout_type VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned INT,
    workout_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- 3. INSERT MOCK DATA
-- ==========================================

INSERT INTO Users (username, password, email, user_level) VALUES
('johndoe', 'hashed_pw_1', 'johndoe@example.com', 'regular'),
('janedoe', 'hashed_pw_2', 'janedoe@example.com', 'admin'),
('fitness_mike', 'hashed_pw_3', 'mike@example.com', 'regular');

INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes) VALUES
(1, '2024-02-01', 'Happy', 70.5, 8, 'Felt great today!'),
(1, '2024-02-02', 'Tired', 70.2, 5, 'Did not sleep well.'),
(2, '2024-02-01', 'Stressed', 65.0, 7, 'Busy day at the office.'),
(3, '2024-02-01', 'Energetic', 80.0, 9, 'Ready to crush it!');

INSERT INTO Workouts (user_id, workout_type, duration_minutes, calories_burned, workout_date) VALUES
(1, 'Running', 30, 350, '2024-02-01'),
(1, 'Yoga', 45, 150, '2024-02-02'),
(3, 'Weightlifting', 60, 500, '2024-02-01');

-- ==========================================
-- 4. USE CASES (Queries, Updates, Deletes)
-- ==========================================

-- USE CASE: User views their profile and all their workouts (JOIN)
SELECT Users.username, Workouts.workout_type, Workouts.duration_minutes, Workouts.calories_burned 
FROM Users 
JOIN Workouts ON Users.user_id = Workouts.user_id 
WHERE Users.username = 'johndoe';

-- USE CASE: User fixes a typo in their diary entry (UPDATE)
UPDATE DiaryEntries 
SET notes = 'Felt great today! Ate healthy.' 
WHERE entry_id = 1;

-- USE CASE: User deletes a workout they entered by mistake (DELETE)
DELETE FROM Workouts 
WHERE workout_id = 2;

-- USE CASE: Admin wants to see all users and their latest diary moods (LEFT JOIN)
SELECT Users.username, DiaryEntries.entry_date, DiaryEntries.mood 
FROM Users
LEFT JOIN DiaryEntries ON Users.user_id = DiaryEntries.user_id
ORDER BY DiaryEntries.entry_date DESC;