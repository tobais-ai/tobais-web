import { 
  users, 
  contactSubmissions,
  blogPosts, 
  projects, 
  testimonials, 
  socialMediaContent, 
  serviceTypes,
  type User, 
  type InsertUser,
  type ContactSubmission, 
  type InsertContact, 
  type BlogPost, 
  type InsertBlogPost, 
  type Project, 
  type InsertProject, 
  type Testimonial, 
  type InsertTestimonial, 
  type SocialMedia, 
  type InsertSocialMedia, 
  type ServiceType, 
  type InsertServiceType 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { Store as SessionStore } from "express-session";
import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import pgSimpleModule from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContact): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  updateContactSubmission(id: number, data: Partial<ContactSubmission>): Promise<ContactSubmission | undefined>;
  
  // Blog posts
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(limit?: number, published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Projects
  createProject(project: InsertProject): Promise<Project>;
  getProjects(featured?: boolean): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getClientProjects(clientId: number): Promise<Project[]>;
  updateProject(id: number, data: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Testimonials
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getTestimonials(approved?: boolean): Promise<Testimonial[]>;
  updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Social Media Content
  createSocialMediaContent(content: InsertSocialMedia): Promise<SocialMedia>;
  getUserSocialMediaContent(userId: number): Promise<SocialMedia[]>;
  updateSocialMediaContent(id: number, data: Partial<SocialMedia>): Promise<SocialMedia | undefined>;
  deleteSocialMediaContent(id: number): Promise<boolean>;
  
  // Service Types
  createServiceType(service: InsertServiceType): Promise<ServiceType>;
  getServiceTypes(): Promise<ServiceType[]>;
  getServiceType(id: number): Promise<ServiceType | undefined>;
  updateServiceType(id: number, data: Partial<ServiceType>): Promise<ServiceType | undefined>;
  deleteServiceType(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: SessionStore;
  
  // Database initialization (for PostgreSQL)
  initializeDatabase?(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private blogPosts: Map<number, BlogPost>;
  private projects: Map<number, Project>;
  private testimonials: Map<number, Testimonial>;
  private socialMediaContents: Map<number, SocialMedia>;
  private serviceTypes: Map<number, ServiceType>;
  
  currentUserId: number;
  currentContactId: number;
  currentBlogId: number;
  currentProjectId: number;
  currentTestimonialId: number;
  currentSocialMediaId: number;
  currentServiceTypeId: number;
  
  sessionStore: SessionStore;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.blogPosts = new Map();
    this.projects = new Map();
    this.testimonials = new Map();
    this.socialMediaContents = new Map();
    this.serviceTypes = new Map();
    
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentBlogId = 1;
    this.currentProjectId = 1;
    this.currentTestimonialId = 1;
    this.currentSocialMediaId = 1;
    this.currentServiceTypeId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with default service types
    this.initializeServices();
    this.initializeTestimonials();
  }
  
  // This is a no-op for in-memory storage as initialization is done in constructor
  async initializeDatabase(): Promise<void> {
    console.log("In-memory storage already initialized");
    return Promise.resolve();
  }

  // Initialize default services
  private initializeServices() {
    const services = [
      {
        name: "Web Design",
        nameEs: "Diseño Web",
        description: "Custom responsive websites that attract and convert visitors with modern designs.",
        descriptionEs: "Sitios web responsivos personalizados que atraen y convierten visitantes con diseños modernos.",
        price: 599,
        features: JSON.stringify(["Responsive design", "SEO optimization", "Modern UI/UX"]),
        featuresEs: JSON.stringify(["Diseño responsivo", "Optimización SEO", "UI/UX moderno"]),
        icon: "laptop-code",
        sortOrder: 1
      },
      {
        name: "Automation",
        nameEs: "Automatización",
        description: "Streamline your business processes with AI-powered automation solutions.",
        descriptionEs: "Optimice sus procesos de negocio con soluciones de automatización impulsadas por IA.",
        price: 899,
        features: JSON.stringify(["Workflow automation", "AI integrations", "Business analytics"]),
        featuresEs: JSON.stringify(["Automatización de flujos", "Integraciones con IA", "Análisis de negocio"]),
        icon: "robot",
        sortOrder: 2
      },
      {
        name: "Branding",
        nameEs: "Branding",
        description: "Create a memorable brand identity that resonates with your target audience.",
        descriptionEs: "Cree una identidad de marca memorable que resuene con su público objetivo.",
        price: 799,
        features: JSON.stringify(["Logo design", "Brand strategy", "Marketing materials"]),
        featuresEs: JSON.stringify(["Diseño de logo", "Estrategia de marca", "Materiales de marketing"]),
        icon: "paint-brush",
        sortOrder: 3
      },
      {
        name: "Social Media Marketing",
        nameEs: "Marketing en Redes Sociales",
        description: "Engage with your audience through strategic social media marketing campaigns on Facebook, Instagram, WhatsApp, and LinkedIn.",
        descriptionEs: "Conecte con su audiencia a través de campañas estratégicas de marketing en redes sociales en Facebook, Instagram, WhatsApp y LinkedIn.",
        price: 699,
        features: JSON.stringify(["Facebook marketing", "Instagram content", "WhatsApp campaigns", "LinkedIn strategy"]),
        featuresEs: JSON.stringify(["Marketing en Facebook", "Contenido para Instagram", "Campañas en WhatsApp", "Estrategia para LinkedIn"]),
        icon: "share-alt",
        sortOrder: 4
      },
      {
        name: "Accounting",
        nameEs: "Contabilidad",
        description: "Professional accounting services to help manage your business finances effectively.",
        descriptionEs: "Servicios de contabilidad profesionales para ayudar a gestionar las finanzas de su negocio de manera efectiva.",
        price: 499,
        features: JSON.stringify(["Bookkeeping", "Tax preparation", "Financial reporting", "Business consulting"]),
        featuresEs: JSON.stringify(["Teneduría de libros", "Preparación de impuestos", "Informes financieros", "Consultoría empresarial"]),
        icon: "calculator",
        sortOrder: 5
      }
    ];
    
    services.forEach(service => {
      this.createServiceType(service as any);
    });
  }
  
  // Initialize default testimonials
  private initializeTestimonials() {
    const testimonials = [
      {
        name: "Sarah Johnson",
        position: "Fitness Studio Owner",
        company: "Fit Life Studio",
        content: "TOBAIS transformed our online presence completely. Our website now perfectly represents our brand, and the automation tools they implemented have saved us countless hours on administrative tasks.",
        contentEs: "TOBAIS transformó completamente nuestra presencia en línea. Nuestro sitio web ahora representa perfectamente nuestra marca, y las herramientas de automatización que implementaron nos han ahorrado incontables horas en tareas administrativas.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        approved: true
      },
      {
        name: "Miguel Ramirez",
        position: "Restaurant Owner",
        company: "Sabores Auténticos",
        content: "Working with TOBAIS was a game-changer for our restaurant. Their bilingual website design helped us reach a broader audience, and their online ordering system increased our sales by 40%.",
        contentEs: "Trabajar con TOBAIS cambió las reglas del juego para nuestro restaurante. Su diseño web bilingüe nos ayudó a llegar a una audiencia más amplia, y su sistema de pedidos en línea aumentó nuestras ventas en un 40%.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        approved: true
      },
      {
        name: "Amanda Chen",
        position: "E-commerce Entrepreneur",
        company: "StyleBox",
        content: "The branding package from TOBAIS helped us establish a strong identity in a competitive market. Their attention to detail and strategic approach to our digital presence exceeded our expectations.",
        contentEs: "El paquete de branding de TOBAIS nos ayudó a establecer una identidad fuerte en un mercado competitivo. Su atención al detalle y enfoque estratégico de nuestra presencia digital superó nuestras expectativas.",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        approved: true
      }
    ];
    
    testimonials.forEach(testimonial => {
      this.createTestimonial(testimonial as any);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      fullName: insertUser.fullName ?? null,
      language: insertUser.language ?? 'en',
      role: "user", 
      isActive: true, 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  // Contact submissions
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const now = new Date();
    const contactSubmission: ContactSubmission = {
      ...submission,
      id,
      serviceId: submission.serviceId || null,
      createdAt: now,
      resolved: false
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }
  
  async updateContactSubmission(id: number, data: Partial<ContactSubmission>): Promise<ContactSubmission | undefined> {
    const submission = await this.getContactSubmission(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, ...data };
    this.contactSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }
  
  // Blog posts
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    const now = new Date();
    
    // Destructure to remove the fields we'll explicitly set
    const { 
      titleEs, contentEs, authorId, published, featuredImage,
      ...otherProps 
    } = post;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const blogPost: BlogPost = {
      ...otherProps,
      id,
      titleEs: titleEs ?? null,
      contentEs: contentEs ?? null,
      authorId: authorId ?? null,
      published: published ?? null,
      featuredImage: featuredImage ?? null,
      createdAt: now
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  async getBlogPosts(limit?: number, published?: boolean): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    if (published !== undefined) {
      posts = posts.filter(post => post.published === published);
    }
    
    posts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (limit) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }
  
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const post = await this.getBlogPost(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...data };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Projects
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    
    // Destructure to remove the fields we'll explicitly set
    const { 
      status, descriptionEs, titleEs, clientId, startDate, endDate, 
      image, featured,
      ...otherProps 
    } = project;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const projectData: Project = {
      ...otherProps,
      id,
      status: status ?? null,
      descriptionEs: descriptionEs ?? null,
      titleEs: titleEs ?? null,
      clientId: clientId ?? null,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      image: image ?? null,
      featured: featured ?? null
    };
    this.projects.set(id, projectData);
    return projectData;
  }
  
  async getProjects(featured?: boolean): Promise<Project[]> {
    let projectList = Array.from(this.projects.values());
    
    if (featured !== undefined) {
      projectList = projectList.filter(project => project.featured === featured);
    }
    
    return projectList;
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getClientProjects(clientId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.clientId === clientId);
  }
  
  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const project = await this.getProject(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...data };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Testimonials
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    // Destructure to remove the fields we'll explicitly set
    const { 
      contentEs, image, position, company, rating, approved,
      ...otherProps 
    } = testimonial;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const testimonialData: Testimonial = {
      ...otherProps,
      id,
      contentEs: contentEs ?? null,
      image: image ?? null,
      position: position ?? null,
      company: company ?? null,
      rating: rating ?? null,
      approved: approved ?? false
    };
    this.testimonials.set(id, testimonialData);
    return testimonialData;
  }
  
  async getTestimonials(approved?: boolean): Promise<Testimonial[]> {
    let testimonialList = Array.from(this.testimonials.values());
    
    if (approved !== undefined) {
      testimonialList = testimonialList.filter(testimonial => testimonial.approved === approved);
    }
    
    return testimonialList;
  }
  
  async updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...data };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }
  
  // Social Media Content
  async createSocialMediaContent(content: InsertSocialMedia): Promise<SocialMedia> {
    const id = this.currentSocialMediaId++;
    const now = new Date();
    
    // Destructure to remove the fields we'll explicitly set
    const { 
      contentEs, image, userId, scheduled, scheduledDate, aiGenerated, metadata,
      ...otherProps 
    } = content;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const socialMediaContent: SocialMedia = {
      ...otherProps,
      id,
      createdAt: now,
      contentEs: contentEs ?? null,
      image: image ?? null,
      userId: userId ?? null,
      scheduled: scheduled ?? null,
      scheduledDate: scheduledDate ?? null,
      aiGenerated: aiGenerated ?? null,
      metadata: metadata ?? null
    };
    this.socialMediaContents.set(id, socialMediaContent);
    return socialMediaContent;
  }
  
  async getUserSocialMediaContent(userId: number): Promise<SocialMedia[]> {
    return Array.from(this.socialMediaContents.values())
      .filter(content => content.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateSocialMediaContent(id: number, data: Partial<SocialMedia>): Promise<SocialMedia | undefined> {
    const content = this.socialMediaContents.get(id);
    if (!content) return undefined;
    
    const updatedContent = { ...content, ...data };
    this.socialMediaContents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteSocialMediaContent(id: number): Promise<boolean> {
    return this.socialMediaContents.delete(id);
  }
  
  // Service Types
  async createServiceType(service: InsertServiceType): Promise<ServiceType> {
    const id = this.currentServiceTypeId++;
    // Destructure to remove the fields we'll explicitly set
    const { 
      nameEs, descriptionEs, features, featuresEs, icon, sortOrder, 
      ...otherProps 
    } = service;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const serviceType: ServiceType = {
      ...otherProps,
      id,
      nameEs: nameEs ?? null,
      descriptionEs: descriptionEs ?? null,
      features: features ?? null,
      featuresEs: featuresEs ?? null,
      icon: icon ?? null,
      sortOrder: sortOrder ?? null
    };
    this.serviceTypes.set(id, serviceType);
    return serviceType;
  }
  
  async getServiceTypes(): Promise<ServiceType[]> {
    return Array.from(this.serviceTypes.values())
      .sort((a, b) => {
        // Handle null values safely
        const sortOrderA = a.sortOrder ?? 0;
        const sortOrderB = b.sortOrder ?? 0;
        return sortOrderA - sortOrderB;
      });
  }
  
  async getServiceType(id: number): Promise<ServiceType | undefined> {
    return this.serviceTypes.get(id);
  }
  
  async updateServiceType(id: number, data: Partial<ServiceType>): Promise<ServiceType | undefined> {
    const service = this.serviceTypes.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...data };
    this.serviceTypes.set(id, updatedService);
    return updatedService;
  }
  
  async deleteServiceType(id: number): Promise<boolean> {
    return this.serviceTypes.delete(id);
  }
}

/**
 * PostgreSQL implementation of storage using Drizzle ORM
 */
export class PostgresStorage implements IStorage {
  db: ReturnType<typeof drizzle>;
  sessionStore: SessionStore;
  
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    // Initialize PostgreSQL client
    const sqlClient = postgres(process.env.DATABASE_URL);
    this.db = drizzle(sqlClient);
    
    // Initialize session store
    const PgSessionStore = pgSimpleModule(session);
    this.sessionStore = new PgSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
    
    console.log("PostgreSQL connection established successfully");
  }

  async initializeDatabase(): Promise<void> {
    console.log("Initializing database...");
    
    try {
      // Check if we have any service types, if not, initialize sample data
      const existingServices = await this.getServiceTypes();
      if (existingServices.length === 0) {
        console.log("Initializing services...");
        await this.initializeServices();
      }
      
      // Check if we have any testimonials, if not, initialize sample data
      const existingTestimonials = await this.getTestimonials();
      if (existingTestimonials.length === 0) {
        console.log("Initializing testimonials...");
        await this.initializeTestimonials();
      }
      
      console.log("Database initialization complete");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // Initialize default services
  private async initializeServices() {    
    const services = [
      {
        name: "Web Design",
        nameEs: "Diseño Web",
        description: "Custom responsive websites that attract and convert visitors with modern designs.",
        descriptionEs: "Sitios web responsivos personalizados que atraen y convierten visitantes con diseños modernos.",
        price: 599,
        features: JSON.stringify(["Responsive design", "SEO optimization", "Modern UI/UX"]),
        featuresEs: JSON.stringify(["Diseño responsivo", "Optimización SEO", "UI/UX moderno"]),
        icon: "laptop-code",
        sortOrder: 1
      },
      {
        name: "Automation",
        nameEs: "Automatización",
        description: "Streamline your business processes with AI-powered automation solutions.",
        descriptionEs: "Optimice sus procesos de negocio con soluciones de automatización impulsadas por IA.",
        price: 899,
        features: JSON.stringify(["Workflow automation", "AI integrations", "Business analytics"]),
        featuresEs: JSON.stringify(["Automatización de flujos", "Integraciones con IA", "Análisis de negocio"]),
        icon: "robot",
        sortOrder: 2
      },
      {
        name: "Branding",
        nameEs: "Branding",
        description: "Create a memorable brand identity that resonates with your target audience.",
        descriptionEs: "Cree una identidad de marca memorable que resuene con su público objetivo.",
        price: 799,
        features: JSON.stringify(["Logo design", "Brand strategy", "Marketing materials"]),
        featuresEs: JSON.stringify(["Diseño de logo", "Estrategia de marca", "Materiales de marketing"]),
        icon: "paint-brush",
        sortOrder: 3
      },
      {
        name: "Social Media Marketing",
        nameEs: "Marketing en Redes Sociales",
        description: "Engage with your audience through strategic social media marketing campaigns on Facebook, Instagram, WhatsApp, and LinkedIn.",
        descriptionEs: "Conecte con su audiencia a través de campañas estratégicas de marketing en redes sociales en Facebook, Instagram, WhatsApp y LinkedIn.",
        price: 699,
        features: JSON.stringify(["Facebook marketing", "Instagram content", "WhatsApp campaigns", "LinkedIn strategy"]),
        featuresEs: JSON.stringify(["Marketing en Facebook", "Contenido para Instagram", "Campañas en WhatsApp", "Estrategia para LinkedIn"]),
        icon: "share-alt",
        sortOrder: 4
      },
      {
        name: "Accounting",
        nameEs: "Contabilidad",
        description: "Professional accounting services to help manage your business finances effectively.",
        descriptionEs: "Servicios de contabilidad profesionales para ayudar a gestionar las finanzas de su negocio de manera efectiva.",
        price: 499,
        features: JSON.stringify(["Bookkeeping", "Tax preparation", "Financial reporting", "Business consulting"]),
        featuresEs: JSON.stringify(["Teneduría de libros", "Preparación de impuestos", "Informes financieros", "Consultoría empresarial"]),
        icon: "calculator",
        sortOrder: 5
      }
    ];
    
    for (const service of services) {
      await this.createServiceType(service as any);
    }
  }
  
  // Initialize default testimonials
  private async initializeTestimonials() {
    const testimonials = [
      {
        name: "Sarah Johnson",
        position: "Fitness Studio Owner",
        company: "Fit Life Studio",
        content: "TOBAIS transformed our online presence completely. Our website now perfectly represents our brand, and the automation tools they implemented have saved us countless hours on administrative tasks.",
        contentEs: "TOBAIS transformó completamente nuestra presencia en línea. Nuestro sitio web ahora representa perfectamente nuestra marca, y las herramientas de automatización que implementaron nos han ahorrado incontables horas en tareas administrativas.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        approved: true
      },
      {
        name: "Miguel Ramirez",
        position: "Restaurant Owner",
        company: "Sabores Auténticos",
        content: "Working with TOBAIS was a game-changer for our restaurant. Their bilingual website design helped us reach a broader audience, and their online ordering system increased our sales by 40%.",
        contentEs: "Trabajar con TOBAIS cambió las reglas del juego para nuestro restaurante. Su diseño web bilingüe nos ayudó a llegar a una audiencia más amplia, y su sistema de pedidos en línea aumentó nuestras ventas en un 40%.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        approved: true
      },
      {
        name: "Amanda Chen",
        position: "E-commerce Entrepreneur",
        company: "StyleBox",
        content: "The branding package from TOBAIS helped us establish a strong identity in a competitive market. Their attention to detail and strategic approach to our digital presence exceeded our expectations.",
        contentEs: "El paquete de branding de TOBAIS nos ayudó a establecer una identidad fuerte en un mercado competitivo. Su atención al detalle y enfoque estratégico de nuestra presencia digital superó nuestras expectativas.",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        approved: true
      }
    ];
    
    for (const testimonial of testimonials) {
      await this.createTestimonial(testimonial as any);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const userData = {
      ...insertUser,
      fullName: insertUser.fullName ?? null,
      language: insertUser.language ?? 'en',
      role: "user",
      isActive: true,
      createdAt: now
    };
    
    const result = await this.db.insert(users).values(userData).returning();
    return result[0];
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const result = await this.db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.count > 0;
  }
  
  // Contact submissions
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const now = new Date();
    const result = await this.db.insert(contactSubmissions).values({
      ...submission,
      createdAt: now,
      resolved: false
    }).returning();
    
    return result[0];
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    const result = await this.db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return result[0];
  }
  
  async updateContactSubmission(id: number, data: Partial<ContactSubmission>): Promise<ContactSubmission | undefined> {
    const result = await this.db.update(contactSubmissions)
      .set(data)
      .where(eq(contactSubmissions.id, id))
      .returning();
    
    return result[0];
  }
  
  // Blog posts
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const now = new Date();
    // Ensure all nullable fields are explicitly set to null if not provided
    const blogPostData = {
      ...post,
      titleEs: post.titleEs ?? null,
      contentEs: post.contentEs ?? null,
      authorId: post.authorId ?? null,
      published: post.published ?? null,
      featuredImage: post.featuredImage ?? null,
      createdAt: now
    };
    
    const result = await this.db.insert(blogPosts).values(blogPostData).returning();
    return result[0];
  }
  
  async getBlogPosts(limit?: number, published?: boolean): Promise<BlogPost[]> {
    if (published !== undefined) {
      const query = this.db.select()
        .from(blogPosts)
        .where(eq(blogPosts.published, published))
        .orderBy(desc(blogPosts.createdAt));
      
      if (limit) {
        return await query.limit(limit);
      }
      
      return await query;
    } else {
      const query = this.db.select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));
      
      if (limit) {
        return await query.limit(limit);
      }
      
      return await query;
    }
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return result[0];
  }
  
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const result = await this.db.update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await this.db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.count > 0;
  }
  
  // Projects
  async createProject(project: InsertProject): Promise<Project> {
    // Destructure to remove the fields we'll explicitly set
    const { 
      status, descriptionEs, titleEs, clientId, startDate, endDate, 
      image, featured,
      ...otherProps 
    } = project;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const projectData = {
      ...otherProps,
      status: status ?? null,
      descriptionEs: descriptionEs ?? null,
      titleEs: titleEs ?? null,
      clientId: clientId ?? null,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      image: image ?? null,
      featured: featured ?? null
    };
    
    const result = await this.db.insert(projects).values(projectData).returning();
    return result[0];
  }
  
  async getProjects(featured?: boolean): Promise<Project[]> {
    if (featured !== undefined) {
      return await this.db.select().from(projects).where(eq(projects.featured, featured));
    }
    
    return await this.db.select().from(projects);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }
  
  async getClientProjects(clientId: number): Promise<Project[]> {
    return await this.db.select().from(projects).where(eq(projects.clientId, clientId));
  }
  
  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const result = await this.db.update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await this.db.delete(projects).where(eq(projects.id, id));
    return result.count > 0;
  }
  
  // Testimonials
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    // Destructure to remove the fields we'll explicitly set
    const { 
      contentEs, image, position, company, rating, approved,
      ...otherProps 
    } = testimonial;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const data = {
      ...otherProps,
      contentEs: contentEs ?? null,
      image: image ?? null,
      position: position ?? null,
      company: company ?? null,
      rating: rating ?? null,
      approved: approved ?? false
    };
    
    const result = await this.db.insert(testimonials).values(data).returning();
    return result[0];
  }
  
  async getTestimonials(approved?: boolean): Promise<Testimonial[]> {
    if (approved !== undefined) {
      return await this.db.select().from(testimonials).where(eq(testimonials.approved, approved));
    }
    
    return await this.db.select().from(testimonials);
  }
  
  async updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const result = await this.db.update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await this.db.delete(testimonials).where(eq(testimonials.id, id));
    return result.count > 0;
  }
  
  // Social Media Content
  async createSocialMediaContent(content: InsertSocialMedia): Promise<SocialMedia> {
    const now = new Date();
    
    // Destructure to remove the fields we'll explicitly set
    const { 
      contentEs, image, userId, scheduled, scheduledDate, aiGenerated, metadata,
      ...otherProps 
    } = content;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const socialMediaData = {
      ...otherProps,
      contentEs: contentEs ?? null,
      image: image ?? null,
      userId: userId ?? null,
      scheduled: scheduled ?? null,
      scheduledDate: scheduledDate ?? null,
      aiGenerated: aiGenerated ?? null,
      metadata: metadata ?? null,
      createdAt: now
    };
    
    const result = await this.db.insert(socialMediaContent).values(socialMediaData).returning();
    return result[0];
  }
  
  async getUserSocialMediaContent(userId: number): Promise<SocialMedia[]> {
    return await this.db
      .select()
      .from(socialMediaContent)
      .where(eq(socialMediaContent.userId, userId))
      .orderBy(desc(socialMediaContent.createdAt));
  }
  
  async updateSocialMediaContent(id: number, data: Partial<SocialMedia>): Promise<SocialMedia | undefined> {
    const result = await this.db.update(socialMediaContent)
      .set(data)
      .where(eq(socialMediaContent.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteSocialMediaContent(id: number): Promise<boolean> {
    const result = await this.db.delete(socialMediaContent).where(eq(socialMediaContent.id, id));
    return result.count > 0;
  }
  
  // Service Types
  async createServiceType(service: InsertServiceType): Promise<ServiceType> {
    // Destructure to remove the fields we'll explicitly set
    const { 
      nameEs, descriptionEs, features, featuresEs, icon, sortOrder, 
      ...otherProps 
    } = service;
    
    // Ensure all nullable fields are explicitly set to null if not provided
    const serviceData = {
      ...otherProps,
      nameEs: nameEs ?? null,
      descriptionEs: descriptionEs ?? null,
      features: features ?? null,
      featuresEs: featuresEs ?? null,
      icon: icon ?? null,
      sortOrder: sortOrder ?? null
    };
    
    const result = await this.db.insert(serviceTypes).values(serviceData).returning();
    return result[0];
  }
  
  async getServiceTypes(): Promise<ServiceType[]> {
    // First ensure we get all services
    const services = await this.db.select().from(serviceTypes);
    
    // Then sort them manually to handle null sortOrder values safely
    return services.sort((a, b) => {
      // If both have null sortOrder, maintain original order
      if (a.sortOrder === null && b.sortOrder === null) {
        return 0;
      }
      
      // Null sortOrder values should come after non-null values
      if (a.sortOrder === null) {
        return 1;
      }
      
      if (b.sortOrder === null) {
        return -1;
      }
      
      // Both have non-null sortOrder, compare them directly
      return a.sortOrder - b.sortOrder;
    });
  }
  
  async getServiceType(id: number): Promise<ServiceType | undefined> {
    const result = await this.db.select().from(serviceTypes).where(eq(serviceTypes.id, id));
    return result[0];
  }
  
  async updateServiceType(id: number, data: Partial<ServiceType>): Promise<ServiceType | undefined> {
    const result = await this.db.update(serviceTypes)
      .set(data)
      .where(eq(serviceTypes.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteServiceType(id: number): Promise<boolean> {
    const result = await this.db.delete(serviceTypes).where(eq(serviceTypes.id, id));
    return result.count > 0;
  }
}

// Uncomment to use PostgreSQL storage
export const storage = new PostgresStorage();
