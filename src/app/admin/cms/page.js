"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PlusCircle, Edit, Trash2, BookOpen, HelpCircle, MessageSquare, Loader2, AlertTriangle, FileText
} from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { catalogService } from "@/services";

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState("blogs");

  // Blog State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    category: "Health Insurance",
    author: "Policy Care Editorial Desk",
    readMinutes: "5",
    body: "",
  });

  // FAQ State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: "General",
    question: "",
    answer: "",
  });

  // Testimonial State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [testToDelete, setTestToDelete] = useState(null);
  const [testForm, setTestForm] = useState({
    name: "",
    role: "Verified Policyholder",
    city: "Mumbai",
    rating: "5",
    quote: "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Queries
  const { data: posts, isLoading: loadingBlogs, refetch: refetchBlogs } = useQuery({
    queryKey: ["blog"],
    queryFn: catalogService.blogPosts,
  });

  const { data: faqs, isLoading: loadingFaqs, refetch: refetchFaqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: catalogService.faqs,
  });

  const { data: testimonials, isLoading: loadingTests, refetch: refetchTests } = useQuery({
    queryKey: ["testimonials"],
    queryFn: catalogService.testimonials,
  });

  // -------------------------------------------------------------
  // BLOG HANDLERS
  // -------------------------------------------------------------
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      title: "",
      excerpt: "",
      category: "Health Insurance",
      author: "Policy Care Editorial Desk",
      readMinutes: "5",
      body: "",
    });
    setBlogModalOpen(true);
  };

  const openEditBlogModal = (post) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      category: post.category || "Health Insurance",
      author: post.author || "Policy Care Editorial Desk",
      readMinutes: String(post.readMinutes || "5"),
      body: post.body || "",
    });
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.body.trim()) {
      toast.error("Please enter an article title and content body.");
      return;
    }

    setSaving(true);
    try {
      if (editingBlog) {
        await catalogService.updateBlogPost(editingBlog.id, {
          ...blogForm,
          readMinutes: parseInt(blogForm.readMinutes, 10) || 5,
        });
        toast.success("Blog article updated successfully.");
      } else {
        await catalogService.createBlogPost({
          ...blogForm,
          readMinutes: parseInt(blogForm.readMinutes, 10) || 5,
        });
        toast.success("New blog article published to website.");
      }
      setBlogModalOpen(false);
      refetchBlogs();
    } catch (err) {
      toast.error(err.message || "Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;
    setDeleting(true);
    try {
      await catalogService.deleteBlogPost(blogToDelete.id);
      toast.success("Blog article deleted.");
      setBlogToDelete(null);
      refetchBlogs();
    } catch (err) {
      toast.error(err.message || "Failed to delete article.");
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // FAQ HANDLERS
  // -------------------------------------------------------------
  const openNewFaqModal = () => {
    setEditingFaq(null);
    setFaqForm({
      category: "General",
      question: "",
      answer: "",
    });
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      category: faq.category || "General",
      question: faq.question || "",
      answer: faq.answer || "",
    });
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error("Please provide both a question and answer.");
      return;
    }

    setSaving(true);
    try {
      if (editingFaq) {
        await catalogService.updateFaq(editingFaq.id, faqForm);
        toast.success("FAQ updated successfully.");
      } else {
        await catalogService.createFaq(faqForm);
        toast.success("New FAQ entry added to knowledge base.");
      }
      setFaqModalOpen(false);
      refetchFaqs();
    } catch (err) {
      toast.error(err.message || "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!faqToDelete) return;
    setDeleting(true);
    try {
      await catalogService.deleteFaq(faqToDelete.id);
      toast.success("FAQ entry deleted.");
      setFaqToDelete(null);
      refetchFaqs();
    } catch (err) {
      toast.error(err.message || "Failed to delete FAQ.");
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // TESTIMONIAL HANDLERS
  // -------------------------------------------------------------
  const openNewTestModal = () => {
    setEditingTest(null);
    setTestForm({
      name: "",
      role: "Verified Policyholder",
      city: "Mumbai",
      rating: "5",
      quote: "",
    });
    setTestModalOpen(true);
  };

  const openEditTestModal = (t) => {
    setEditingTest(t);
    setTestForm({
      name: t.name || "",
      role: t.role || "Verified Policyholder",
      city: t.city || "Mumbai",
      rating: String(t.rating || "5"),
      quote: t.quote || "",
    });
    setTestModalOpen(true);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testForm.name.trim() || !testForm.quote.trim()) {
      toast.error("Please enter client name and testimonial review quote.");
      return;
    }

    setSaving(true);
    try {
      if (editingTest) {
        await catalogService.updateTestimonial(editingTest.id, {
          ...testForm,
          rating: parseInt(testForm.rating, 10) || 5,
        });
        toast.success("Testimonial updated successfully.");
      } else {
        await catalogService.createTestimonial({
          ...testForm,
          rating: parseInt(testForm.rating, 10) || 5,
        });
        toast.success("New testimonial added to website.");
      }
      setTestModalOpen(false);
      refetchTests();
    } catch (err) {
      toast.error(err.message || "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!testToDelete) return;
    setDeleting(true);
    try {
      await catalogService.deleteTestimonial(testToDelete.id);
      toast.success("Testimonial deleted.");
      setTestToDelete(null);
      refetchTests();
    } catch (err) {
      toast.error(err.message || "Failed to delete testimonial.");
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // COLUMNS
  // -------------------------------------------------------------
  const blogColumns = [
    {
      key: "title",
      header: "Article Title",
      sortValue: (r) => r.title,
      cell: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{r.excerpt || r.body}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => <span className="capitalize">{r.category}</span> },
    { key: "author", header: "Author", hideOnMobile: true, cell: (r) => r.author || "Policy Care" },
    { key: "date", header: "Published", sortValue: (r) => r.date, cell: (r) => r.date || "—" },
    {
      key: "actions",
      header: "Actions",
      cell: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => openEditBlogModal(r)}
            title="Edit article"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => setBlogToDelete(r)}
            title="Delete article"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const faqColumns = [
    {
      key: "question",
      header: "Question",
      sortValue: (r) => r.question,
      cell: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.question}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{r.answer}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => <span className="capitalize">{r.category}</span> },
    {
      key: "actions",
      header: "Actions",
      cell: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => openEditFaqModal(r)}
            title="Edit FAQ"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => setFaqToDelete(r)}
            title="Delete FAQ"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const testimonialColumns = [
    {
      key: "name",
      header: "Customer",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.role} · {r.city}</p>
        </div>
      ),
    },
    {
      key: "quote",
      header: "Review Quote",
      cell: (r) => <p className="text-xs text-foreground italic line-clamp-2">“{r.quote}”</p>,
    },
    {
      key: "rating",
      header: "Rating",
      cell: (r) => <span className="font-bold text-amber-500">★ {r.rating || 5}/5</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => openEditTestModal(r)}
            title="Edit testimonial"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => setTestToDelete(r)}
            title="Delete testimonial"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PortalPage
      role="ADMIN"
      title="Content Management (CMS)"
      description="Create, edit, and publish blogs, FAQs, and customer reviews across the website."
      actions={
        activeTab === "blogs" ? (
          <Button onClick={openNewBlogModal}>
            <PlusCircle className="mr-2 size-4" /> New Article
          </Button>
        ) : activeTab === "faqs" ? (
          <Button onClick={openNewFaqModal}>
            <PlusCircle className="mr-2 size-4" /> New FAQ
          </Button>
        ) : (
          <Button onClick={openNewTestModal}>
            <PlusCircle className="mr-2 size-4" /> New Testimonial
          </Button>
        )
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:w-96">
          <TabsTrigger value="blogs" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <BookOpen className="size-4" /> Blogs ({posts?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <HelpCircle className="size-4" /> FAQs ({faqs?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <MessageSquare className="size-4" /> Reviews ({testimonials?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: BLOGS */}
        <TabsContent value="blogs" className="space-y-4">
          <DataTable
            data={posts}
            loading={loadingBlogs}
            rowKey={(r) => r.id}
            columns={blogColumns}
            searchKeys={(r) => `${r.title} ${r.category} ${r.author}`}
            searchPlaceholder="Search blog articles"
            exportable
          />
        </TabsContent>

        {/* TAB 2: FAQS */}
        <TabsContent value="faqs" className="space-y-4">
          <DataTable
            data={faqs}
            loading={loadingFaqs}
            rowKey={(r) => r.id}
            columns={faqColumns}
            searchKeys={(r) => `${r.question} ${r.category} ${r.answer}`}
            searchPlaceholder="Search FAQs"
            exportable
          />
        </TabsContent>

        {/* TAB 3: TESTIMONIALS */}
        <TabsContent value="testimonials" className="space-y-4">
          <DataTable
            data={testimonials}
            loading={loadingTests}
            rowKey={(r) => r.id}
            columns={testimonialColumns}
            searchKeys={(r) => `${r.name} ${r.city} ${r.quote}`}
            searchPlaceholder="Search testimonials"
            exportable
          />
        </TabsContent>
      </Tabs>

      {/* ----------------- BLOG MODAL ----------------- */}
      <Dialog open={blogModalOpen} onOpenChange={setBlogModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit Blog Article" : "Publish New Blog Article"}</DialogTitle>
            <DialogDescription>
              Write informative insurance guides and publish directly to the public /blog section.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveBlog} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="bg-title">Article Title <span className="text-destructive">*</span></Label>
              <Input
                id="bg-title"
                required
                placeholder="e.g. How to Choose the Right Health Insurance Floater"
                value={blogForm.title}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bg-cat">Category</Label>
                <Input
                  id="bg-cat"
                  placeholder="Health Insurance"
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bg-auth">Author</Label>
                <Input
                  id="bg-auth"
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bg-time">Read Time (Mins)</Label>
                <Input
                  id="bg-time"
                  type="number"
                  min={1}
                  value={blogForm.readMinutes}
                  onChange={(e) => setBlogForm({ ...blogForm, readMinutes: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bg-exc">Short Excerpt / Teaser</Label>
              <Input
                id="bg-exc"
                placeholder="A quick summary shown in previews"
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bg-body">Full Article Body <span className="text-destructive">*</span></Label>
              <Textarea
                id="bg-body"
                rows={6}
                required
                placeholder="Write article content here..."
                value={blogForm.body}
                onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setBlogModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                  </>
                ) : editingBlog ? (
                  "Save Changes"
                ) : (
                  "Publish Article"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------- FAQ MODAL ----------------- */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ Entry" : "Add FAQ Entry"}</DialogTitle>
            <DialogDescription>
              Add clear question-and-answer pairs to the public FAQ knowledge base.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveFaq} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="faq-cat">Category</Label>
              <Input
                id="faq-cat"
                placeholder="e.g. Health, Claims, Payments, Renewals"
                value={faqForm.category}
                onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faq-q">Question <span className="text-destructive">*</span></Label>
              <Input
                id="faq-q"
                required
                placeholder="e.g. How does cashless claim settlement work?"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faq-a">Answer <span className="text-destructive">*</span></Label>
              <Textarea
                id="faq-a"
                rows={4}
                required
                placeholder="Provide a clear, comprehensive explanation..."
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setFaqModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                  </>
                ) : editingFaq ? (
                  "Save Changes"
                ) : (
                  "Save FAQ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------- TESTIMONIAL MODAL ----------------- */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTest ? "Edit Testimonial" : "Add Customer Review"}</DialogTitle>
            <DialogDescription>
              Feature authentic customer feedback on the marketplace homepage.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTestimonial} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-name">Customer Name <span className="text-destructive">*</span></Label>
                <Input
                  id="t-name"
                  required
                  placeholder="e.g. Rajesh Khurana"
                  value={testForm.name}
                  onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="t-city">City</Label>
                <Input
                  id="t-city"
                  placeholder="e.g. Bengaluru"
                  value={testForm.city}
                  onChange={(e) => setTestForm({ ...testForm, city: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-role">Designation / Role</Label>
                <Input
                  id="t-role"
                  placeholder="e.g. Business Owner / Policyholder"
                  value={testForm.role}
                  onChange={(e) => setTestForm({ ...testForm, role: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="t-rat">Rating (1 to 5 Stars)</Label>
                <select
                  id="t-rat"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={testForm.rating}
                  onChange={(e) => setTestForm({ ...testForm, rating: e.target.value })}
                >
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★☆ (4 Stars)</option>
                  <option value="3">★★★☆☆ (3 Stars)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="t-quote">Review Quote <span className="text-destructive">*</span></Label>
              <Textarea
                id="t-quote"
                rows={3}
                required
                placeholder="“Policy Care helped me settle my cashless hospital claim in under 45 minutes…”"
                value={testForm.quote}
                onChange={(e) => setTestForm({ ...testForm, quote: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setTestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                  </>
                ) : editingTest ? (
                  "Save Changes"
                ) : (
                  "Add Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------- DELETE BLOG DIALOG ----------------- */}
      <Dialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete Blog Article
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{blogToDelete?.title}</strong>? It will be removed from the public /blog page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogToDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlog} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete Article"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------- DELETE FAQ DIALOG ----------------- */}
      <Dialog open={!!faqToDelete} onOpenChange={(open) => !open && setFaqToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete FAQ Entry
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ: <strong>{faqToDelete?.question}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqToDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFaq} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete FAQ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------- DELETE TESTIMONIAL DIALOG ----------------- */}
      <Dialog open={!!testToDelete} onOpenChange={(open) => !open && setTestToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete Testimonial
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the review from <strong>{testToDelete?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestToDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTestimonial} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
