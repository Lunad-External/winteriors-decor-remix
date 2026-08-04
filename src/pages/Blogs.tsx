import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/common/PageHero";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { blogs as staticBlogs, resolveBlogImageUrl } from "@/data/blogs";
import { useDbBlogs } from "@/hooks/useDbBlogs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import heroBlogs from "@/assets/hero-blogs.jpg";

const BLOGS_PER_PAGE = 9;

const BlogsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { blogs: dbBlogs, loading: dbLoading } = useDbBlogs();

  const blogs = useMemo(() => {
    const dbSlugs = new Set(dbBlogs.map((b) => b.slug));
    const mapped = dbBlogs.map((b) => ({
      id: b.slug,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || "",
      image: resolveBlogImageUrl((b.slider_images && b.slider_images[0]) || b.image_url),
      date: b.published_date || "",
    }));
    const rest = staticBlogs.filter((s) => !dbSlugs.has(s.slug));
    return [...mapped, ...rest];
  }, [dbBlogs]);

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIdx = (currentPage - 1) * BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIdx, startIdx + BLOGS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Layout>
      <Helmet>
        <title>Blogs & Insights | Winteriors Decor LLC</title>
        <meta
          name="description"
          content="Explore insights on workplace design, sustainability, and interior design trends from Winteriors Decor experts."
        />
      </Helmet>
      <PageHero
        title="Blogs & Updates"
        subtitle="Insights on workplace design, sustainability, and interior design trends."
        backgroundImage={heroBlogs}
        compact
      />
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbLoading
              ? Array.from({ length: BLOGS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video rounded-2xl bg-muted mb-4" />
                    <div className="h-4 w-24 bg-muted rounded mb-2" />
                    <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                ))
              : currentBlogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to="/blogs/$slug" params={{ slug: blog.slug }} className="block">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <span className="text-sm text-muted-foreground">{blog.date}</span>
                <h3 className="text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>
                <Link
                  to="/blogs/$slug"
                  params={{ slug: blog.slug }}
                  className="text-primary font-medium hover:underline"
                >
                  Read More →
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, idx) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogsPage;
