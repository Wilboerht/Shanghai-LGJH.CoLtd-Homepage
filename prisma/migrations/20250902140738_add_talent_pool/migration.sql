/*
  Warnings:

  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_folders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `navigation_logo_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `navigation_menus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "media";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "media_folders";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "navigation_logo_configs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "navigation_menus";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pages";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "talent_pool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "application_id" TEXT NOT NULL,
    "current_position" TEXT,
    "current_company" TEXT,
    "expected_salary" TEXT,
    "availability" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "rating" INTEGER DEFAULT 3,
    "tags" TEXT,
    "notes" TEXT,
    "added_by" TEXT NOT NULL,
    "added_reason" TEXT,
    "last_contact_at" DATETIME,
    "next_follow_up" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "talent_pool_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "job_applications" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "talent_pool_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "talent_interactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talent_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "next_action" TEXT,
    "scheduled_at" DATETIME,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "talent_interactions_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_pool" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "talent_interactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "talent_pool_application_id_key" ON "talent_pool"("application_id");
