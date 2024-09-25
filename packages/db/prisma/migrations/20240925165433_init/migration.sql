/*
  Warnings:

  - You are about to drop the column `userId` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `contactId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "userId",
ADD COLUMN     "contactId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
