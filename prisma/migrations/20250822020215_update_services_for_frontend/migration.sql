-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "service_type" TEXT NOT NULL DEFAULT 'core',
    "level" TEXT NOT NULL DEFAULT 'intermediate',
    "duration" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "icon" TEXT,
    "background_image" TEXT,
    "highlight" TEXT,
    "features" JSONB,
    "hero" JSONB,
    "learning" JSONB,
    "course_info" JSONB,
    "about" JSONB,
    "cta" JSONB,
    "process" JSONB,
    "visual_elements" JSONB,
    "cta_config" JSONB,
    "metrics" JSONB,
    "seo" JSONB,
    "display_order" INTEGER,
    "slug" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "published_at" DATETIME,
    CONSTRAINT "services_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_services" ("about", "category", "course_info", "created_at", "cta", "cta_config", "description", "duration", "features", "hero", "id", "learning", "level", "metrics", "process", "published_at", "seo", "slug", "status", "subtitle", "title", "updated_at", "updated_by", "visual_elements") SELECT "about", "category", "course_info", "created_at", "cta", "cta_config", "description", "duration", "features", "hero", "id", "learning", "level", "metrics", "process", "published_at", "seo", "slug", "status", "subtitle", "title", "updated_at", "updated_by", "visual_elements" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
