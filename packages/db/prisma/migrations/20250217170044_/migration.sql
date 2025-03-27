/*
  Warnings:

  - You are about to drop the column `authorId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `ConvoLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserConversations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,contactId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ConvoLink" DROP CONSTRAINT "ConvoLink_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ConvoLink" DROP CONSTRAINT "ConvoLink_messageId_fkey";

-- DropForeignKey
ALTER TABLE "UserConversations" DROP CONSTRAINT "UserConversations_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "UserConversations" DROP CONSTRAINT "UserConversations_userId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "authorId",
DROP COLUMN "contactName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "conversationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ConvoLink";

-- DropTable
DROP TABLE "UserConversations";

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("userId","conversationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_contactId_key" ON "Contact"("userId", "contactId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
