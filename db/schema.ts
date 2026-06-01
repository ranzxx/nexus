import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, pgEnum } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[]; driverData: string; config: { length: number } }>({
  dataType(config) {
    return `vector(${config?.length ?? 1024})`;
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
  fromDriver(value) {
    return JSON.parse(value);
  },
});

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);
export const planEnum = pgEnum("plan", ["free", "pro"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  plan: planEnum("plan").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ===== APP TABLES =====

export const document = pgTable(
  "document",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(), // nama file asli
    fileUrl: text("file_url").notNull(), // URL di R2
    fileSize: integer("file_size").notNull(), // bytes
    fileType: text("file_type").notNull(), // "pdf" | "txt" | "docx"
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("document_userId_idx").on(table.userId)],
);

export const chunk = pgTable(
  "chunk",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(), // potongan teks dari dokumen
    embedding: vector("embedding", { length: 1024 }).notNull(), // OpenAI ada-002 embedding
    documentId: text("document_id")
      .notNull()
      .references(() => document.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(), // urutan chunk dalam dokumen
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chunk_documentId_idx").on(table.documentId)],
);

export const conversation = pgTable(
  "conversation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").default("New Chat").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    documentId: text("document_id").references(() => document.id, {
      onDelete: "set null",
    }), // optional, bisa chat tanpa dokumen
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("conversation_userId_idx").on(table.userId)],
);

export const message = pgTable(
  "message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    role: messageRoleEnum('role').notNull(),
    content: text("content").notNull(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("message_conversationId_idx").on(table.conversationId)],
);

// ===== RELATIONS =====

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  documents: many(document),
  conversations: many(conversation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const documentRelations = relations(document, ({ one, many }) => ({
  user: one(user, { fields: [document.userId], references: [user.id] }),
  chunks: many(chunk),
  conversations: many(conversation),
}));

export const chunkRelations = relations(chunk, ({ one }) => ({
  document: one(document, {
    fields: [chunk.documentId],
    references: [document.id],
  }),
}));

export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    user: one(user, { fields: [conversation.userId], references: [user.id] }),
    document: one(document, {
      fields: [conversation.documentId],
      references: [document.id],
    }),
    messages: many(message),
  }),
);

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  document,
  chunk,
  conversation,
  message,
};