-- Table to store account information
CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT NULL,
    "type" TEXT NOT NULL DEFAULT NULL,
    "provider" TEXT NOT NULL DEFAULT NULL,
    "providerAccountId" TEXT NOT NULL DEFAULT NULL,
    "refresh_token" TEXT DEFAULT NULL,
    "access_token" TEXT DEFAULT NULL,
    "expires_at" INTEGER DEFAULT NULL,
    "token_type" TEXT DEFAULT NULL,
    "scope" TEXT DEFAULT NULL,
    "id_token" TEXT DEFAULT NULL,
    "session_state" TEXT DEFAULT NULL,
    "oauth_token_secret" TEXT DEFAULT NULL,
    "oauth_token" TEXT DEFAULT NULL,
    PRIMARY KEY ("id")
);

-- Table to store session information
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT NULL,
    "expires" DATETIME NOT NULL DEFAULT NULL,
    PRIMARY KEY ("sessionToken")
);

-- Table to store user information
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL DEFAULT '',
    "name" TEXT DEFAULT NULL,
    "email" TEXT DEFAULT NULL,
    "emailVerified" DATETIME DEFAULT NULL,
    "image" TEXT DEFAULT NULL,
    PRIMARY KEY ("id")
);

-- Table to store verification tokens
CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL DEFAULT NULL,
    "expires" DATETIME NOT NULL DEFAULT NULL,
    PRIMARY KEY ("token")
);

-- Table to store organization information
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("adminId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Index to improve query performance on the organizations table
CREATE INDEX IF NOT EXISTS "organizationsIdx" ON "organizations" ("adminId");

-- Table to store platform information
CREATE TABLE IF NOT EXISTS "platforms" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "callbackUrl" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE
);

-- Index to improve query performance on the platforms table
CREATE INDEX IF NOT EXISTS "platformsIdx" ON "platforms" ("organizationId");

-- Table to establish many-to-many relationship between platforms and moderators
CREATE TABLE IF NOT EXISTS "platformModerators" (
    "platformId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    PRIMARY KEY ("platformId", "userId"),
    FOREIGN KEY ("platformId") REFERENCES "platforms" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Index to improve query performance on the platformModerators table
CREATE INDEX IF NOT EXISTS "idxPlatformModeratorsPlatformId" ON "platformModerators" ("platformId");

-- Index to improve query performance on the platformModerators table
CREATE INDEX IF NOT EXISTS "idxPlatformModeratorsUserId" ON "platformModerators" ("userId");

-- Table to store all recorded cases and their current status
CREATE TABLE IF NOT EXISTS "cases" (
    "platformId" TEXT NOT NULL,
    "relevantId" TEXT NOT NULL,
    -- content, account, community
    "kind" TEXT NOT NULL,
    -- resolved, unresolved
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "assignedTo" TEXT DEFAULT NULL,
    "assignedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("platformId") REFERENCES "platforms" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("platformId", "relevantId", "kind")
);

-- Table to store all actions
CREATE TABLE IF NOT EXISTS "actions" (
    "platformId" TEXT NOT NULL,
    "relevantId" TEXT NOT NULL,
    "authorId" TEXT,
    -- content, account, community
    "kind" TEXT NOT NULL,
    "actionInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("platformId") REFERENCES "platforms" ("id") ON DELETE CASCADE
);

-- Index to improve query performance on the actions table
CREATE INDEX IF NOT EXISTS "idxActions" ON "actions" ("platformId", "relevantId", "kind");

CREATE TABLE IF NOT EXISTS "caseViews" (
    "userId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "relevantId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "viewedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("userId", "platformId", "relevantId", "kind"),
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("platformId", "relevantId", "kind") REFERENCES "cases" ("platformId", "relevantId", "kind") ON DELETE CASCADE
);