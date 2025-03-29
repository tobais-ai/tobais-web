import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
