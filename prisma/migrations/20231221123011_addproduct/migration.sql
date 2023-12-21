/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `imagePath` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imagePath" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;
