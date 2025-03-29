import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ContactSubmission, Testimonial } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("contacts");
  
  // Fetch contact submissions
  const { data: contacts, isLoading: isLoadingContacts } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contacts"],
  });
  
  // Fetch testimonials
  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });
  
  // Mutation to update contact submission
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, resolved }: { id: number, resolved: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/contacts/${id}`, { resolved });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Success",
        description: "Contact submission updated",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update contact",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to update testimonial
  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number, approved: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/testimonials/${id}`, { approved });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial updated",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update testimonial",
        variant: "destructive",
      });
    },
  });
  
  // Handle marking contact as resolved/unresolved
  const handleContactUpdate = (id: number, resolved: boolean) => {
    updateContactMutation.mutate({ id, resolved });
  };
  
  // Handle approving/disapproving testimonial
  const handleTestimonialUpdate = (id: number, approved: boolean) => {
    updateTestimonialMutation.mutate({ id, approved });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.adminPanel")}</CardTitle>
        <CardDescription>Manage contacts, testimonials, and more</CardDescription>
        <TabsList className="mt-2">
          <TabsTrigger value="contacts" onClick={() => setActiveTab("contacts")}>Contact Submissions</TabsTrigger>
          <TabsTrigger value="testimonials" onClick={() => setActiveTab("testimonials")}>Testimonials</TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent>
        {activeTab === "contacts" && (
          <>
            {isLoadingContacts ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : contacts && contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className={`border rounded-md p-4 ${contact.resolved ? 'opacity-70' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{contact.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        contact.resolved 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {contact.resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <a href={`mailto:${contact.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 border-t pt-2 whitespace-pre-line">
                      {contact.message}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(contact.createdAt).toLocaleString()}
                      </div>
                      <div>
                        {contact.resolved ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleContactUpdate(contact.id, false)}
                          >
                            Mark as Pending
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleContactUpdate(contact.id, true)}
                          >
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No contact submissions
              </div>
            )}
          </>
        )}
        
        {activeTab === "testimonials" && (
          <>
            {isLoadingTestimonials ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className={`border rounded-md p-4 ${testimonial.approved ? '' : 'border-dashed'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.position && testimonial.company 
                            ? `${testimonial.position}, ${testimonial.company}`
                            : testimonial.position || testimonial.company}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        testimonial.approved 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {testimonial.approved ? 'Approved' : 'Pending Review'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 border-t pt-2 whitespace-pre-line">
                      {language === 'es' && testimonial.contentEs ? testimonial.contentEs : testimonial.content}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex">
                        {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                        {testimonial.rating % 1 > 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {testimonial.approved ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleTestimonialUpdate(testimonial.id, false)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Disapprove
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleTestimonialUpdate(testimonial.id, true)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No testimonials
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
