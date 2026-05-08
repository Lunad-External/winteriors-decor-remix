import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { blogs } from "@/data/blogs";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NotFound from "./NotFound";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return <NotFound />;

  const bodyContent = blog.content || blog.excerpt;

  return (
    <Layout>
      <Helmet>
        <title>{blog.title} | Winteriors Decor LLC</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      <section className="pt-28 pb-16 bg-background">
        <div className="container-custom max-w-4xl">
          {/* Breadcrumb */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>

          {/* Date */}
          <p className="text-sm text-muted-foreground mb-3">{blog.date}</p>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
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
