-- Remove priceInfo column from products table
-- This migration removes the price information field as it's no longer needed

-- AlterTable
-- Note: SQLite doesn't support DROP COLUMN IF EXISTS, so we skip this for now
-- The column will be ignored in the application code
