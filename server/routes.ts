import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertContactSchema, insertProjectSchema, insertTestimonialSchema, insertSocialMediaSchema, insertBlogPostSchema } from "@shared/schema";
import { generateSocialMediaContent, generateMultiPlatformContent, generateContentRecommendations } from "./openai";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: Missing STRIPE_SECRET_KEY. Stripe payments will not work properly.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Contact form submission
  app.post("/api/contact", async (req, res, next) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      next(error);
    }
  });

  // Get service types
  app.get("/api/services", async (_req, res, next) => {
    try {
      const services = await storage.getServiceTypes();
      res.json(services);
    } catch (error) {
      next(error);
    }
  });

  // Get approved testimonials
  app.get("/api/testimonials", async (_req, res, next) => {
    try {
      const testimonials = await storage.getTestimonials(true);
      res.json(testimonials);
    } catch (error) {
      next(error);
    }
  });

  // Submit testimonial
  app.post("/api/testimonials", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      next(error);
    }
  });

  // Projects
  app.get("/api/projects", async (req, res, next) => {
    try {
      const featured = req.query.featured === "true";
      const projects = await storage.getProjects(featured);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  });

  // Client projects (authenticated)
  app.get("/api/user/projects", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const projects = await storage.getClientProjects(req.user.id);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  });

  // Create project (admin only)
  app.post("/api/projects", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  });

  // Social Media Content Generation
  app.post("/api/social-media/generate", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { prompt, platform, language = "en" } = req.body;
      
      if (!prompt || !platform) {
        return res.status(400).json({ message: "Prompt and platform are required" });
      }
      
      const generatedContent = await generateSocialMediaContent(prompt, platform, language);
      res.json(generatedContent);
    } catch (error: any) {
      next(error);
    }
  });

  // Multi-platform content generation
  app.post("/api/social-media/multi-platform", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { prompt, platforms, language = "en" } = req.body;
      
      if (!prompt || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({ message: "Prompt and platforms array are required" });
      }
      
      const generatedContent = await generateMultiPlatformContent(prompt, platforms, language);
      res.json(generatedContent);
    } catch (error) {
      next(error);
    }
  });

  // Save social media content
  app.post("/api/social-media/save", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const contentData = {
        ...req.body,
        userId: req.user.id
      };
      
      const validatedData = insertSocialMediaSchema.parse(contentData);
      const savedContent = await storage.createSocialMediaContent(validatedData);
      res.status(201).json(savedContent);
    } catch (error) {
      next(error);
    }
  });

  // Get user's social media content
  app.get("/api/social-media", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const content = await storage.getUserSocialMediaContent(req.user.id);
      res.json(content);
    } catch (error) {
      next(error);
    }
  });

  // Content recommendations
  app.post("/api/content-recommendations", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { audience, industry, language = "en" } = req.body;
      
      if (!audience || !industry) {
        return res.status(400).json({ message: "Audience and industry are required" });
      }
      
      const recommendations = await generateContentRecommendations(audience, industry, language);
      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Get all contact submissions
  app.get("/api/admin/contacts", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Update contact submission
  app.patch("/api/admin/contacts/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updated = await storage.updateContactSubmission(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Manage testimonials
  app.patch("/api/admin/testimonials/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updated = await storage.updateTestimonial(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Get all testimonials including unapproved
  app.get("/api/admin/testimonials", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      next(error);
    }
  });

  // Blog posts endpoints
  
  // Get published blog posts
  app.get("/api/blog", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getBlogPosts(limit, true); // Only published posts
      res.json(posts);
    } catch (error) {
      next(error);
    }
  });
  
  // Get a single blog post by slug
  app.get("/api/blog/:slug", async (req, res, next) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Only return published posts to public users
      if (!post.published && (!req.isAuthenticated() || req.user?.role !== "admin")) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      next(error);
    }
  });
  
  // Admin: Create a new blog post
  app.post("/api/admin/blog", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const postData = {
        ...req.body,
        authorId: req.user.id
      };
      
      const validatedData = insertBlogPostSchema.parse(postData);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  });
  
  // Admin: Get all blog posts including drafts
  app.get("/api/admin/blog", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  });
  
  // Admin: Update a blog post
  app.patch("/api/admin/blog/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updated = await storage.updateBlogPost(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });
  
  // Admin: Delete a blog post
  app.delete("/api/admin/blog/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res, next) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Authentication required" });
        }
        
        const { amount, serviceId } = req.body;
        
        if (!amount || amount <= 0) {
          return res.status(400).json({ message: "Valid amount is required" });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          metadata: {
            userId: req.user?.id.toString(),
            serviceId: serviceId?.toString() || "",
          }
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
