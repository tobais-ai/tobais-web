import { storage } from "./storage";
import { InsertBlogPost, InsertUser } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log("Seeding database with test data...");
  
  // Create a test admin user
  const adminUser: InsertUser = {
    username: "admin",
    password: await hashPassword("admin123"),
    email: "admin@example.com",
    fullName: "Admin User",
    language: "en"
  };
  
  // Create a test regular user
  const regularUser: InsertUser = {
    username: "user",
    password: await hashPassword("user123"),
    email: "user@example.com",
    fullName: "Regular User",
    language: "en"
  };
  
  console.log("Creating test users...");
  let admin, user;
  try {
    // Check if users already exist
    const existingAdmin = await storage.getUserByUsername("admin");
    const existingUser = await storage.getUserByUsername("user");
    
    admin = existingAdmin || await storage.createUser(adminUser);
    user = existingUser || await storage.createUser(regularUser);
    
    console.log(`Admin user id: ${admin.id}`);
    console.log(`Regular user id: ${user.id}`);
  } catch (error) {
    console.error("Error creating users:", error);
    return;
  }
  
  // Sample blog posts
  const blogPosts: InsertBlogPost[] = [
    {
      title: "Getting Started with Digital Marketing",
      titleEs: "Comenzando con Marketing Digital",
      content: `Digital marketing is crucial for businesses in today's digital landscape. Here are some tips to get started:

1. Define your target audience
2. Create a content strategy
3. Optimize your website for search engines
4. Use social media effectively
5. Analyze and adapt your strategy

In this blog post, we'll explore each of these steps in detail to help you launch a successful digital marketing campaign.`,
      contentEs: `El marketing digital es crucial para las empresas en el panorama digital actual. Aquí hay algunos consejos para comenzar:

1. Define tu público objetivo
2. Crea una estrategia de contenido
3. Optimiza tu sitio web para motores de búsqueda
4. Utiliza las redes sociales de manera efectiva
5. Analiza y adapta tu estrategia

En esta publicación de blog, exploraremos cada uno de estos pasos en detalle para ayudarte a lanzar una campaña de marketing digital exitosa.`,
      authorId: admin.id,
      published: true,
      slug: "getting-started-with-digital-marketing",
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
    },
    {
      title: "The Importance of Responsive Web Design",
      titleEs: "La importancia del diseño web responsivo",
      content: `Responsive web design is no longer optional—it's essential. With mobile devices accounting for more than half of all web traffic, your website must look and function well on screens of all sizes.

Key benefits of responsive design include:
- Improved user experience
- Better SEO rankings
- Increased conversion rates
- Lower maintenance costs
- Faster page loading speeds

Let's explore how implementing responsive design can transform your online presence and improve your business outcomes.`,
      contentEs: `El diseño web responsivo ya no es opcional, es esencial. Con los dispositivos móviles representando más de la mitad de todo el tráfico web, tu sitio web debe verse y funcionar bien en pantallas de todos los tamaños.

Los beneficios clave del diseño responsivo incluyen:
- Mejora de la experiencia del usuario
- Mejores rankings SEO
- Mayores tasas de conversión
- Menores costos de mantenimiento
- Mayor velocidad de carga de páginas

Exploremos cómo implementar un diseño responsivo puede transformar tu presencia en línea y mejorar los resultados de tu negocio.`,
      authorId: admin.id,
      published: true,
      slug: "importance-of-responsive-web-design",
      featuredImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop"
    },
    {
      title: "Automation Strategies for Small Businesses",
      titleEs: "Estrategias de automatización para pequeñas empresas",
      content: `Automation isn't just for big corporations. Small businesses can benefit tremendously from implementing strategic automation in their workflows. 

Areas where small businesses can implement automation:
1. Email marketing and customer communication
2. Social media posting and monitoring
3. Customer relationship management
4. Inventory and order management
5. Accounting and invoicing

This post will guide you through practical automation tools and strategies that won't break the bank but will save you countless hours.`,
      contentEs: `La automatización no es solo para grandes corporaciones. Las pequeñas empresas pueden beneficiarse enormemente de implementar automatización estratégica en sus flujos de trabajo.

Áreas donde las pequeñas empresas pueden implementar automatización:
1. Marketing por email y comunicación con clientes
2. Publicación y monitoreo en redes sociales
3. Gestión de relaciones con clientes
4. Gestión de inventario y pedidos
5. Contabilidad y facturación

Esta publicación te guiará a través de herramientas y estrategias prácticas de automatización que no romperán tu presupuesto pero te ahorrarán innumerables horas.`,
      authorId: admin.id,
      published: true,
      slug: "automation-strategies-small-businesses",
      featuredImage: "https://images.unsplash.com/photo-1520869562399-e772f042f422?w=800&auto=format&fit=crop"
    },
    {
      title: "Effective Branding on a Budget",
      titleEs: "Branding efectivo con presupuesto limitado",
      content: `You don't need a massive budget to build a strong brand. With strategic planning and creativity, small businesses can create impactful branding that resonates with their audience.

Budget-friendly branding strategies:
- Develop a clear brand story and values
- Create a consistent visual identity
- Leverage user-generated content
- Build partnerships with complementary businesses
- Utilize free or low-cost design tools

This guide will show you how to build a memorable brand without breaking the bank.`,
      contentEs: `No necesitas un presupuesto enorme para construir una marca fuerte. Con planificación estratégica y creatividad, las pequeñas empresas pueden crear una marca impactante que resuene con su audiencia.

Estrategias de branding económicas:
- Desarrollar una historia de marca clara y valores definidos
- Crear una identidad visual consistente
- Aprovechar el contenido generado por usuarios
- Construir alianzas con negocios complementarios
- Utilizar herramientas de diseño gratuitas o de bajo costo

Esta guía te mostrará cómo construir una marca memorable sin gastar demasiado.`,
      authorId: user.id,
      published: true,
      slug: "effective-branding-on-budget",
      featuredImage: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=800&auto=format&fit=crop"
    },
    {
      title: "AI Tools for Content Creation",
      titleEs: "Herramientas de IA para creación de contenido",
      content: `Artificial intelligence is revolutionizing content creation, allowing marketers and business owners to produce high-quality content more efficiently than ever before.

In this post, we explore the top AI tools for:
- Writing assistance and idea generation
- Image creation and editing
- Video production
- Social media content optimization
- Content personalization

Learn how to ethically and effectively incorporate AI into your content strategy while maintaining your brand's authentic voice.`,
      contentEs: `La inteligencia artificial está revolucionando la creación de contenido, permitiendo a los especialistas en marketing y dueños de negocios producir contenido de alta calidad de manera más eficiente que nunca.

En esta publicación, exploramos las mejores herramientas de IA para:
- Asistencia en escritura y generación de ideas
- Creación y edición de imágenes
- Producción de videos
- Optimización de contenido en redes sociales
- Personalización de contenido

Aprende cómo incorporar la IA de manera ética y efectiva en tu estrategia de contenido mientras mantienes la voz auténtica de tu marca.`,
      authorId: admin.id,
      published: false, // Draft post
      slug: "ai-tools-content-creation",
      featuredImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop"
    }
  ];
  
  console.log("Creating blog posts...");
  for (const post of blogPosts) {
    try {
      // Check if post with this slug already exists
      const existingPost = await storage.getBlogPostBySlug(post.slug);
      if (!existingPost) {
        await storage.createBlogPost(post);
        console.log(`Created blog post: ${post.title}`);
      } else {
        console.log(`Blog post already exists: ${post.title}`);
      }
    } catch (error) {
      console.error(`Error creating blog post '${post.title}':`, error);
    }
  }
  
  console.log("Database seeding completed!");
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log("Seed script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error running seed script:", error);
    process.exit(1);
  });