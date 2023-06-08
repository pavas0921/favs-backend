/*
  Warnings:

  - Added the required column `fav_link` to the `fav` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fav` ADD COLUMN `fav_link` VARCHAR(255) NOT NULL;
