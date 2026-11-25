import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { StatsSection } from "@/components/home/StatsSection";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { ProjectHighlights } from "@/components/home/ProjectHighlights";
import { VideoGallery } from "@/components/home/VideoGallery";
import { ClientsSection } from "@/components/home/ClientsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Winteriors Decor LLC | Premium Interior Design & Fit-Out Dubai & Abu Dhabi</title>
        <meta name="description" content="Winteriors Decor LLC - 17+ years of excellence in commercial interior design and fit-out solutions." />
      </Helmet>
      <HeroSection />
      <AboutPreview />
      <StatsSection />
      <ExpertiseSection />
      <ProjectHighlights />
      <VideoGallery />
      <ClientsSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Index;
