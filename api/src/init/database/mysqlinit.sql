CREATE TABLE USER (
    userId VARCHAR(64) PRIMARY KEY,
    description VARCHAR(512) DEFAULT "",
    username VARCHAR(64) NOT NULL DEFAULT "NoName",
    profileImage VARCHAR(255),
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    followings TEXT DEFAULT "",
    followers TEXT DEFAULT "",
    madeRuleBook TEXT DEFAULT "",
    eloRating INT DEFAULT 1000,
    isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)