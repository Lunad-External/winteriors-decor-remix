export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "The efforts put in by Winteriors to build our head office were instrumental in completing an extremely time constrained project. They were professional in their approach, did a quality job in a concerted manner, met committed deadlines and delivered the project to our satisfaction.",
    author: "Ali Hamdani",
    position: "MD",
    company: "The Linde Group",
  },
  {
    id: 2,
    quote: "They were professional in their approach, did a quality job in a concerted manner, met committed deadlines and delivered the project to our satisfaction.",
    author: "Sanjay Amar",
    position: "Director",
    company: "Jackys",
  },
];
