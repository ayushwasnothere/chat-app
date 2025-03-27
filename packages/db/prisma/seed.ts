import prisma from "../src/index";

async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create Users
  const users = await prisma.user.createMany({
    data: [
      { id: "user1", username: "alice", password: "pass123", name: "Alice" },
      { id: "user2", username: "bob", password: "pass123", name: "Bob" },
      {
        id: "user3",
        username: "charlie",
        password: "pass123",
        name: "Charlie",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Users created");

  // 2️⃣ Add Contacts
  await prisma.contact.createMany({
    data: [
      { userId: "user1", contactId: "user2" }, // Alice -> Bob
      { userId: "user1", contactId: "user3" }, // Alice -> Charlie
      { userId: "user2", contactId: "user1" }, // Bob -> Alice
    ],
    skipDuplicates: true,
  });

  console.log("✅ Contacts added");

  // 3️⃣ Create Private Conversation (Alice & Bob)
  const privateConversation = await prisma.conversation.create({
    data: {
      name: null, // Null for private chats
      isGroup: false,
      participants: {
        create: [
          { user: { connect: { id: "user1" } } },
          { user: { connect: { id: "user2" } } },
        ],
      },
    },
  });

  // 4️⃣ Create Group Conversation (Alice, Bob & Charlie)
  const groupConversation = await prisma.conversation.create({
    data: {
      name: "Friends Group",
      isGroup: true,
      participants: {
        create: [
          { user: { connect: { id: "user1" } }, isAdmin: true },
          { user: { connect: { id: "user2" } } },
          { user: { connect: { id: "user3" } } },
        ],
      },
    },
  });

  console.log("✅ Conversations created");

  // 5️⃣ Add Messages to Conversations
  await prisma.message.createMany({
    data: [
      {
        senderId: "user1",
        conversationId: privateConversation.id,
        content: "Hey Bob, how are you?",
      },
      {
        senderId: "user2",
        conversationId: privateConversation.id,
        content: "Hey Alice! I'm good. How about you?",
      },
      {
        senderId: "user3",
        conversationId: groupConversation.id,
        content: "Hello everyone!",
      },
    ],
  });

  console.log("✅ Messages added");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("🎉 Seeding complete!");
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
