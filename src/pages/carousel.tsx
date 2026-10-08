import { useState } from "react";
import {
  Carousel,
  CarouselSlide,
  CodeSnippet,
  Container,
} from "../../lib/main";

const slides = [
  ["01", "Keyboard ready", "Use arrow keys, Home, and End."],
  ["02", "Touch friendly", "Swipe on a touch device."],
  ["03", "Accessible", "Slides and controls include meaningful labels."],
] as const;

const code = `<Carousel loop={false} label="Feature highlights">
  <CarouselSlide>First slide</CarouselSlide>
  <CarouselSlide>Second slide</CarouselSlide>
</Carousel>`;

export default function CarouselPage() {
  const [index, setIndex] = useState(0);

  return (
    <Container title="Carousel" fullWidth animate="scroll" rounded>
      <p className="font-mono text-sm font-bold" aria-live="polite">
        Viewing slide {index + 1} of {slides.length}
      </p>
      <Carousel
        index={index}
        onIndexChange={setIndex}
        loop={false}
        label="Feature highlights"
        variant="secondary"
        rounded
      >
        {slides.map(([number, title, description]) => (
          <CarouselSlide key={number}>
            <div className="flex min-h-64 flex-col justify-center gap-3 px-20 py-10 text-center sm:min-h-72">
              <span className="font-mono text-5xl font-black">{number}</span>
              <h2 className="text-2xl font-black uppercase">{title}</h2>
              <p>{description}</p>
            </div>
          </CarouselSlide>
        ))}
      </Carousel>
      <Carousel
        label="Square compact carousel"
        variant="primary"
        size="sm"
        indicators={false}
      >
        <CarouselSlide>
          <div className="flex min-h-32 items-center justify-center px-16 py-8 font-bold uppercase">
            Square slide one
          </div>
        </CarouselSlide>
        <CarouselSlide>
          <div className="flex min-h-32 items-center justify-center px-16 py-8 font-bold uppercase">
            Square slide two
          </div>
        </CarouselSlide>
      </Carousel>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
