-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "features" JSONB,
    "specifications" JSONB,
    "applications" JSONB,
    "benefits" JSONB,
    "image" TEXT,
    "images" JSONB,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "slug" TEXT NOT NULL,
    "tags" JSONB,
    "gradient" TEXT,
    "accent_color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updated_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "products_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("accent_color", "applications", "benefits", "category", "created_at", "description", "features", "gradient", "id", "image", "images", "slug", "specifications", "status", "subtitle", "tags", "title", "updated_at", "updated_by") SELECT "accent_color", "applications", "benefits", "category", "created_at", "description", "features", "gradient", "id", "image", "images", "slug", "specifications", "status", "subtitle", "tags", "title", "updated_at", "updated_by" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
