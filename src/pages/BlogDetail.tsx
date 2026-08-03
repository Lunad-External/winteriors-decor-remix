import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { blogs, resolveBlogImageUrls, resolveBlogImageUrl } from "@/data/blogs";
import { useDbBlog } from "@/hooks/useDbBlogs";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NotFound from "./NotFound";

const BASE_KEYWORDS = [
  "Interior Design",
  "Office Fit-Out",
  "Workspace Design",
  "Commercial Interiors",
  "Dubai Fit-Out",
  "Office Furniture",
  "Turnkey Solutions",
  "Space Planning",
  "Corporate Design",
  "Sustainable Design",
  "Modern Workspace",
  "Ergonomic Design",
];

const TITLE_KEYWORDS: Array<{ match: RegExp; keyword: string }> = [
  { match: /fit-?out/i, keyword: "Fit-Out" },
  { match: /furniture/i, keyword: "Office Furniture" },
  { match: /abu dhabi/i, keyword: "Abu Dhabi" },
  { match: /dubai/i, keyword: "Dubai" },
  { match: /sustainab|green|eco/i, keyword: "Sustainability" },
  { match: /ergonom/i, keyword: "Ergonomics" },
  { match: /lifecycle|delivery|project/i, keyword: "Project Delivery" },
  { match: /design/i, keyword: "Interior Design" },
  { match: /workspace|workplace/i, keyword: "Workspace Design" },
  { match: /office/i, keyword: "Office Interiors" },
  { match: /premium|luxury/i, keyword: "Premium Interiors" },
  { match: /consult/i, keyword: "Design Consultancy" },
  { match: /turnkey/i, keyword: "Turnkey Solutions" },
  { match: /renovat|refurb/i, keyword: "Renovation" },
];

function fallbackKeywords(title: string): string[] {
  const picked = new Set<string>();
  for (const { match, keyword } of TITLE_KEYWORDS) {
    if (match.test(title)) picked.add(keyword);
    if (picked.size >= 7) break;
  }
  for (const kw of BASE_KEYWORDS) {
    if (picked.size >= 7) break;
    picked.add(kw);
  }
  return Array.from(picked).slice(0, 7);
}

const BlogDetail = () => {
  const { slug } = useParams({ from: "/blogs/$slug" });
  const { blog: dbBlog, loading } = useDbBlog(slug);
  const staticBlog = blogs.find((b) => b.slug === slug);
  const [slideIdx, setSlideIdx] = useState(0);

  if (loading && !staticBlog) {
    return (
      <Layout>
        <section className="pt-28 pb-16 min-h-[60vh] container-custom" />
      </Layout>
    );
  }

  if (!dbBlog && !staticBlog) return <NotFound />;

  const title = dbBlog?.title || staticBlog!.title;
  const excerpt = dbBlog?.excerpt || staticBlog?.excerpt || "";
  const date = dbBlog?.published_date || staticBlog?.date || "";
  const bodyContent = dbBlog?.content || staticBlog?.content || staticBlog?.excerpt || "";
  const sliderImages = resolveBlogImageUrls(
    (dbBlog?.slider_images && dbBlog.slider_images.length > 0
      ? dbBlog.slider_images
      : dbBlog?.image_url
        ? [dbBlog.image_url]
        : staticBlog
          ? [staticBlog.image]
          : []) as string[],
  );
  const activeSlide = resolveBlogImageUrl(sliderImages[slideIdx]);
  const keywords =
    dbBlog?.keywords && dbBlog.keywords.length > 0
      ? dbBlog.keywords
      : fallbackKeywords(title);

  const next = () => setSlideIdx((i) => (i + 1) % sliderImages.length);
  const prev = () => setSlideIdx((i) => (i - 1 + sliderImages.length) % sliderImages.length);

  return (
    <Layout>
      <Helmet>
        <title>{title} | Winteriors Decor LLC</title>
        <meta name="description" content={excerpt} />
      </Helmet>

      <section className="pt-28 pb-16 bg-background">
        <div className="container-custom max-w-4xl">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>

          {date && <p className="text-sm text-muted-foreground mb-3">{date}</p>}

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            {title}
          </h1>

          {sliderImages.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden mb-10 bg-muted">
              <img
                src={activeSlide}
                alt={`${title} - image ${slideIdx + 1}`}
                className="w-full h-auto object-cover max-h-[520px]"
              />
              {sliderImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {sliderImages.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to image ${i + 1}`}
                        onClick={() => setSlideIdx(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === slideIdx ? "bg-primary" : "bg-background/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mb-10">
            <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary [&_p]:mb-8 [&_p]:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {bodyContent}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetail;
