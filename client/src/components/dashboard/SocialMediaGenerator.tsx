import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Form schema
const generateSchema = z.object({
  prompt: z.string().min(10, "Please provide more details for better content generation"),
  platform: z.string().min(1, "Platform is required"),
  language: z.enum(["en", "es"]).default("en")
});

// Multi-platform schema
const multiPlatformSchema = z.object({
  prompt: z.string().min(10, "Please provide more details for better content generation"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  language: z.enum(["en", "es"]).default("en")
});

// Recommendations schema
const recommendationsSchema = z.object({
  audience: z.string().min(5, "Please describe your audience in more detail"),
  industry: z.string().min(3, "Industry is required"),
  language: z.enum(["en", "es"]).default("en")
});

type GenerateFormValues = z.infer<typeof generateSchema>;
type MultiPlatformFormValues = z.infer<typeof multiPlatformSchema>;
type RecommendationsFormValues = z.infer<typeof recommendationsSchema>;

interface ContentResponse {
  content: string;
  hashtags: string[];
}

interface MultiPlatformResponse {
  [platform: string]: ContentResponse;
}

interface RecommendationsResponse {
  topics: string[];
  contentTypes: string[];
  platforms: string[];
}

export default function SocialMediaGenerator() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("single");
  
  // Single platform states
  const [generatedContent, setGeneratedContent] = useState<ContentResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Multi-platform states
  const [multiContent, setMultiContent] = useState<MultiPlatformResponse | null>(null);
  const [isGeneratingMulti, setIsGeneratingMulti] = useState(false);
  
  // Recommendations states
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  // Form setup
  const generateForm = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: "",
      platform: "",
      language: language
    }
  });
  
  const multiPlatformForm = useForm<MultiPlatformFormValues>({
    resolver: zodResolver(multiPlatformSchema),
    defaultValues: {
      prompt: "",
      platforms: [],
      language: language
    }
  });
  
  const recommendationsForm = useForm<RecommendationsFormValues>({
    resolver: zodResolver(recommendationsSchema),
    defaultValues: {
      audience: "",
      industry: "",
      language: language
    }
  });
  
  // Single platform content generation
  const onGenerateSubmit = async (values: GenerateFormValues) => {
    setIsGenerating(true);
    
    try {
      const response = await apiRequest("POST", "/api/social-media/generate", values);
      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save generated content
  const saveContent = async () => {
    if (!generatedContent) return;
    
    setIsSaving(true);
    
    try {
      const platform = generateForm.getValues("platform");
      const contentData = {
        platform,
        content: generatedContent.content,
        contentEs: language === "es" ? generatedContent.content : "",
        aiGenerated: true,
        metadata: JSON.stringify({ hashtags: generatedContent.hashtags }),
        scheduled: false
      };
      
      await apiRequest("POST", "/api/social-media/save", contentData);
      
      toast({
        title: "Success",
        description: t("dashboard.socialMediaGenerator.savedSuccess"),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Multi-platform content generation
  const onMultiPlatformSubmit = async (values: MultiPlatformFormValues) => {
    setIsGeneratingMulti(true);
    
    try {
      const response = await apiRequest("POST", "/api/social-media/multi-platform", values);
      const data = await response.json();
      setMultiContent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate multi-platform content",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMulti(false);
    }
  };
  
  // Get content recommendations
  const onRecommendationsSubmit = async (values: RecommendationsFormValues) => {
    setIsLoadingRecommendations(true);
    
    try {
      const response = await apiRequest("POST", "/api/content-recommendations", values);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.socialMediaGenerator.title")}</CardTitle>
          <CardDescription>{t("dashboard.socialMediaGenerator.description")}</CardDescription>
          <TabsList className="mt-2">
            <TabsTrigger value="single">Single Platform</TabsTrigger>
            <TabsTrigger value="multi">{t("dashboard.socialMediaGenerator.multiPlatform")}</TabsTrigger>
            <TabsTrigger value="recommendations">{t("dashboard.contentRecommendations.title")}</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="single" className="space-y-6">
            <Form {...generateForm}>
              <form onSubmit={generateForm.handleSubmit(onGenerateSubmit)} className="space-y-4">
                <FormField
                  control={generateForm.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.socialMediaGenerator.businessInfo")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("dashboard.socialMediaGenerator.prompt")}
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={generateForm.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dashboard.socialMediaGenerator.platform")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("dashboard.socialMediaGenerator.selectPlatform")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="twitter">{t("dashboard.socialMediaGenerator.twitter")}</SelectItem>
                            <SelectItem value="facebook">{t("dashboard.socialMediaGenerator.facebook")}</SelectItem>
                            <SelectItem value="instagram">{t("dashboard.socialMediaGenerator.instagram")}</SelectItem>
                            <SelectItem value="linkedin">{t("dashboard.socialMediaGenerator.linkedin")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generateForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dashboard.socialMediaGenerator.language")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    t("dashboard.socialMediaGenerator.generate")
                  )}
                </Button>
              </form>
            </Form>
            
            {generatedContent && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">{t("dashboard.socialMediaGenerator.generatedContent")}</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
                  <p className="whitespace-pre-line">{generatedContent.content}</p>
                </div>
                
                {generatedContent.hashtags.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium mb-2">{t("dashboard.socialMediaGenerator.hashtags")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    onClick={saveContent} 
                    disabled={isSaving}
                    variant="outline"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      t("dashboard.socialMediaGenerator.save")
                    )}
                  </Button>
                  <Button disabled>
                    {t("dashboard.socialMediaGenerator.schedule")}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="multi" className="space-y-6">
            <Form {...multiPlatformForm}>
              <form onSubmit={multiPlatformForm.handleSubmit(onMultiPlatformSubmit)} className="space-y-4">
                <FormField
                  control={multiPlatformForm.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.socialMediaGenerator.businessInfo")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("dashboard.socialMediaGenerator.prompt")}
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={multiPlatformForm.control}
                    name="platforms"
                    render={() => (
                      <FormItem>
                        <FormLabel>{t("dashboard.socialMediaGenerator.selectPlatforms")}</FormLabel>
                        <div className="space-y-2">
                          {["twitter", "facebook", "instagram", "linkedin"].map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                              <Checkbox
                                id={platform}
                                onCheckedChange={(checked) => {
                                  const currentPlatforms = multiPlatformForm.getValues("platforms");
                                  const updatedPlatforms = checked
                                    ? [...currentPlatforms, platform]
                                    : currentPlatforms.filter(p => p !== platform);
                                  multiPlatformForm.setValue("platforms", updatedPlatforms, { shouldValidate: true });
                                }}
                              />
                              <label
                                htmlFor={platform}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t(`dashboard.socialMediaGenerator.${platform}`)}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={multiPlatformForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dashboard.socialMediaGenerator.language")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isGeneratingMulti}
                  className="w-full"
                >
                  {isGeneratingMulti ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    t("dashboard.socialMediaGenerator.generateMulti")
                  )}
                </Button>
              </form>
            </Form>
            
            {multiContent && (
              <div className="mt-8 space-y-8">
                {Object.entries(multiContent).map(([platform, content]) => (
                  <div key={platform} className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2 capitalize">{platform}</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
                      <p className="whitespace-pre-line">{content.content}</p>
                    </div>
                    
                    {content.hashtags.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium mb-2">{t("dashboard.socialMediaGenerator.hashtags")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {content.hashtags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-md text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            <Form {...recommendationsForm}>
              <form onSubmit={recommendationsForm.handleSubmit(onRecommendationsSubmit)} className="space-y-4">
                <FormField
                  control={recommendationsForm.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.contentRecommendations.audience")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience (e.g., small business owners in the US, aged 30-45)"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={recommendationsForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.contentRecommendations.industry")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your industry (e.g., e-commerce, healthcare, finance)"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={recommendationsForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.socialMediaGenerator.language")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoadingRecommendations}
                  className="w-full"
                >
                  {isLoadingRecommendations ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    t("dashboard.contentRecommendations.generate")
                  )}
                </Button>
              </form>
            </Form>
            
            {recommendations ? (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">{t("dashboard.contentRecommendations.topics")}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.topics.map((topic, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{topic}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">{t("dashboard.contentRecommendations.contentTypes")}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.contentTypes.map((type, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{type}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">{t("dashboard.contentRecommendations.platforms")}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.platforms.map((platform, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{platform}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-8 p-6 border border-dashed rounded-md text-center">
                <p className="text-gray-500 dark:text-gray-400">{t("dashboard.contentRecommendations.noRecommendations")}</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
