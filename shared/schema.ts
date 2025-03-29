import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, foreignKey, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  language: text("language").default("en").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  language: true,
});

// Contact Submissions Table
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  serviceId: integer("service_id").references(() => serviceTypes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolved: boolean("resolved").default(false),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
  serviceId: true,
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEs: text("title_es"),
  content: text("content").notNull(),
  contentEs: text("content_es"),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  published: boolean("published").default(false),
  slug: text("slug").notNull().unique(),
  featuredImage: text("featured_image"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  titleEs: true,
  content: true,
  contentEs: true,
  authorId: true,
  published: true,
  slug: true,
  featuredImage: true,
});

// Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEs: text("title_es"),
  description: text("description").notNull(),
  descriptionEs: text("description_es"),
  clientId: integer("client_id").references(() => users.id),
  status: text("status").default("pending"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  image: text("image"),
  featured: boolean("featured").default(false),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  titleEs: true,
  description: true,
  descriptionEs: true,
  clientId: true,
  status: true,
  startDate: true,
  endDate: true,
  image: true,
  featured: true,
});

// Testimonials Table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position"),
  company: text("company"),
  content: text("content").notNull(),
  contentEs: text("content_es"),
  rating: integer("rating").default(5),
  image: text("image"),
  approved: boolean("approved").default(false),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  position: true,
  company: true,
  content: true,
  contentEs: true,
  rating: true,
  image: true,
  approved: true,
});

// Social Media Content Table
export const socialMediaContent = pgTable("social_media_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  contentEs: text("content_es"),
  image: text("image"),
  scheduled: boolean("scheduled").default(false),
  scheduledDate: timestamp("scheduled_date"),
  aiGenerated: boolean("ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export const insertSocialMediaSchema = createInsertSchema(socialMediaContent).pick({
  userId: true,
  platform: true,
  content: true,
  contentEs: true,
  image: true,
  scheduled: true,
  scheduledDate: true,
  aiGenerated: true,
  metadata: true,
});

// Service Types
export const serviceTypes = pgTable("service_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEs: text("name_es"),
  description: text("description").notNull(),
  descriptionEs: text("description_es"),
  price: integer("price").notNull(),
  features: jsonb("features"),
  featuresEs: jsonb("features_es"),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0),
});

export const insertServiceTypeSchema = createInsertSchema(serviceTypes).pick({
  name: true,
  nameEs: true,
  description: true,
  descriptionEs: true,
  price: true,
  features: true,
  featuresEs: true,
  icon: true,
  sortOrder: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertSocialMedia = z.infer<typeof insertSocialMediaSchema>;
export type SocialMedia = typeof socialMediaContent.$inferSelect;

export type InsertServiceType = z.infer<typeof insertServiceTypeSchema>;
export type ServiceType = typeof serviceTypes.$inferSelect;

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status").default("pending").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stripePaymentId: text("stripe_payment_id"),
  stripeCustomerId: text("stripe_customer_id"),
  notes: text("notes"),
  shippingAddress: jsonb("shipping_address"),
  paymentMethod: text("payment_method").default("stripe"),
  discountCode: text("discount_code"),
  discountAmount: integer("discount_amount").default(0),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  total: true,
  stripePaymentId: true,
  stripeCustomerId: true,
  notes: true,
  shippingAddress: true,
  paymentMethod: true,
  discountCode: true,
  discountAmount: true,
});

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  serviceId: integer("service_id").references(() => serviceTypes.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: integer("price").notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  serviceId: true,
  quantity: true,
  price: true,
  name: true,
  description: true,
});

// Project Milestones Table
export const projectMilestones = pgTable("project_milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  titleEs: text("title_es"),
  description: text("description"),
  descriptionEs: text("description_es"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  status: text("status").default("pending").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const insertProjectMilestoneSchema = createInsertSchema(projectMilestones).pick({
  projectId: true,
  title: true,
  titleEs: true,
  description: true,
  descriptionEs: true,
  dueDate: true,
  completedAt: true,
  status: true,
  sortOrder: true,
});

// Project Updates Table
export const projectUpdates = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  contentEs: text("content_es"),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(true),
});

export const insertProjectUpdateSchema = createInsertSchema(projectUpdates).pick({
  projectId: true,
  userId: true,
  content: true,
  contentEs: true,
  attachments: true,
  isPublic: true,
});

// Project Comments Table
export const projectComments = pgTable("project_comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  attachments: jsonb("attachments"),
});

export const insertProjectCommentSchema = createInsertSchema(projectComments).pick({
  projectId: true,
  userId: true,
  content: true,
  attachments: true,
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  orders: many(orders),
  projectComments: many(projectComments),
  projectUpdates: many(projectUpdates),
  socialMediaContent: many(socialMediaContent),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, {
    fields: [projects.clientId],
    references: [users.id],
  }),
  milestones: many(projectMilestones),
  updates: many(projectUpdates),
  comments: many(projectComments),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  service: one(serviceTypes, {
    fields: [orderItems.serviceId],
    references: [serviceTypes.id],
  }),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one }) => ({
  project: one(projects, {
    fields: [projectMilestones.projectId],
    references: [projects.id],
  }),
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, {
    fields: [projectUpdates.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectUpdates.userId],
    references: [users.id],
  }),
}));

export const projectCommentsRelations = relations(projectComments, ({ one }) => ({
  project: one(projects, {
    fields: [projectComments.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectComments.userId],
    references: [users.id],
  }),
}));

export const socialMediaContentRelations = relations(socialMediaContent, ({ one }) => ({
  user: one(users, {
    fields: [socialMediaContent.userId],
    references: [users.id],
  }),
}));

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertProjectMilestone = z.infer<typeof insertProjectMilestoneSchema>;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;

export type InsertProjectUpdate = z.infer<typeof insertProjectUpdateSchema>;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;

export type InsertProjectComment = z.infer<typeof insertProjectCommentSchema>;
export type ProjectComment = typeof projectComments.$inferSelect;
