# Raven

**Raven** is a full-featured, real-time web chat application built with **Next.js** and **TypeScript**, combining **WebSockets** and **REST APIs** for speed, efficiency, and reliability.

It uses **Turborepo** for monorepo management, **PostgreSQL** as the database, and **Prisma** as the ORM.

---

## Features

- ⚡ **Real-time messaging** with WebSockets (`ws`)
- 🔄 **REST API fallback** for reliability
- 🛠 Fully typed with **TypeScript**
- 📦 Scalable **monorepo** structure using Turborepo
- 🗄 **PostgreSQL** database with **Prisma ORM**
- 🚀 Fast, efficient, and reliable messaging

---

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | Next.js (TypeScript)           |
| Backend    | Next.js API Routes + REST APIs |
| WebSockets | ws                             |
| Database   | PostgreSQL                     |
| ORM        | Prisma                         |
| Monorepo   | Turborepo                      |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ayushwasnothere/raven.git
cd raven
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up the database

- Create a PostgreSQL database
- Add your database URL to a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/raven"
```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting!

---

## Usage

Raven is built to be fast, efficient, and reliable. It supports:

- 1-on-1 chats and group chats
- Real-time updates via WebSockets
- Persistent message history stored in PostgreSQL
- Full REST API fallback to ensure no message is lost

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch:

```bash
git checkout -b feature-name
```

3. Commit your changes:

```bash
git commit -m "Add feature"
```

4. Push to your branch:

```bash
git push origin feature-name
```

5. Open a pull request

---

## License

[MIT](LICENSE)

---

## Project Preview

Here’s how Raven looks in action:

```bash
$ pnpm dev
> Server running at http://localhost:3000
[WS] Connected to chat server
[REST] Messages loaded successfully
```

Chat in real-time. Fast, sleek, and dependable.

---

Built with ❤️ by[citxruzz](https://citxruzz.tech)
