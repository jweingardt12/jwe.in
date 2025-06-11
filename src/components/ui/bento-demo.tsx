import {
  Globe,
  Code,
  Smartphone,
  Camera,
  BarChart3,
  FileText,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: FileText,
    name: "Personal Website",
    description: "A modern personal website built with Next.js, featuring a photo gallery, blog, and work portfolio with dark mode support.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=entropy&auto=format" alt="Website development" className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-span-2",
  },
  {
    Icon: BarChart3,
    name: "Analytics Dashboard",
    description: "Custom dashboards and analytics tools for tracking user engagement and photo statistics.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=entropy&auto=format" alt="Analytics dashboard" className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1",
  },
  {
    Icon: Code,
    name: "API Development",
    description: "RESTful APIs and serverless functions for content management and data processing.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=entropy&auto=format" alt="API development" className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1",
  },
  {
    Icon: Camera,
    name: "Photography Integration",
    description: "Dynamic photo galleries with real-time Unsplash API integration and EXIF data display.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&crop=entropy&auto=format" alt="Photography" className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-span-2",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="grid-cols-1 lg:grid-cols-2 lg:grid-rows-2">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo }; 