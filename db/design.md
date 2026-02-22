# Health Diary Database Design

Here is the Entity Relationship Diagram for the Health Diary app, including the new `Workouts` table.

```mermaid
erDiagram

Users {
    int user_id PK
    varchar username
    varchar password
    varchar email
    datetime created_at
    varchar user_level
}

DiaryEntries {
    int entry_id PK
    int user_id FK
    date entry_date
    varchar mood
    decimal weight
    int sleep_hours
    text notes
    datetime created_at
}

Workouts {
    int workout_id PK
    int user_id FK
    varchar workout_type
    int duration_minutes
    int calories_burned
    date workout_date
}

Users ||--o{ DiaryEntries : "has"
Users ||--o{ Workouts : "performs"