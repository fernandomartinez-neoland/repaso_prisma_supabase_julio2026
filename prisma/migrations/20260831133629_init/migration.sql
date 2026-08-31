/*
  Warnings:

  - You are about to drop the column `email` on the `Invoices` table. All the data in the column will be lost.
  - Added the required column `price` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoices_email_key";

-- AlterTable
ALTER TABLE "Invoices" DROP COLUMN "email",
ADD COLUMN     "price" INTEGER NOT NULL;
