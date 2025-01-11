CREATE TABLE USER (
    userId VARCHAR(64) PRIMARY KEY,
    description VARCHAR(512) DEFAULT "",
    username VARCHAR(64) NOT NULL DEFAULT "NoName",
    profileImage VARCHAR(255),
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    madeRuleBook TEXT DEFAULT "",
    eloRating INT DEFAULT 1000,
    isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FOLLOW (
    followerId VARCHAR(64) NOT NULL,
    followingId VARCHAR(64) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follows_pk PRIMARY KEY (followerId, followingId),
    FOREIGN KEY (followerId) REFERENCES USER(userId),
    FOREIGN KEY (followingId) REFERENCES USER(userId)
);

CREATE TABLE REPORT (
    reportId INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(64) NOT NULL,
    targetUserId VARCHAR(64) NOT NULL,
    reason VARCHAR(512) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES USER(userId),
    FOREIGN KEY (targetUserId) REFERENCES USER(userId)
);

CREATE TABLE BLOCK (
    userId VARCHAR(64) NOT NULL,
    targetUserId VARCHAR(64) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT blocks_pk PRIMARY KEY (userId, targetUserId),
    FOREIGN KEY (userId) REFERENCES USER(userId),
    FOREIGN KEY (targetUserId) REFERENCES USER(userId)
);