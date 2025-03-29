import { users, User, InsertUser, contactSubmissions, ContactSubmission, InsertContact, blogPosts, BlogPost, InsertBlogPost, projects, Project, InsertProject, testimonials, Testimonial, InsertTestimonial, socialMediaContent, SocialMedia, InsertSocialMedia, serviceTypes, ServiceType, InsertServiceType } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
  sessionStore: session.SessionStore;
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
  
  sessionStore: session.SessionStore;

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
    const blogPost: BlogPost = {
      ...post,
      id,
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
    const projectData: Project = {
      ...project,
      id
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
    const testimonialData: Testimonial = {
      ...testimonial,
      id,
      approved: false
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
    const socialMediaContent: SocialMedia = {
      ...content,
      id,
      createdAt: now
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
    const serviceType: ServiceType = {
      ...service,
      id
    };
    this.serviceTypes.set(id, serviceType);
    return serviceType;
  }
  
  async getServiceTypes(): Promise<ServiceType[]> {
    return Array.from(this.serviceTypes.values())
      .sort((a, b) => a.sortOrder - b.sortOrder);
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

export const storage = new MemStorage();
