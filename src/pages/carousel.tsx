import { useState } from "react";
import { Carousel, CarouselSlide, Container } from "../../lib/main";
import { carouselNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const slides = [
  ["01", "Keyboard ready", "Use arrow keys, Home, and End."],
  ["02", "Touch friendly", "Swipe on a touch device."],
  ["03", "Accessible", "Slides and controls include meaningful labels."],
] as const;

export default function CarouselPage() {
  const [index, setIndex] = useState(0);

  return (
    <Container title="Carousel" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        A carousel cycles slides. Arrow keys, Home, and End move between them.
        On a touch device, swipe.
      </p>

      <Example
        imports="Carousel, CarouselSlide"
        title="Controlled"
        summary="index and onIndexChange keep the current slide. loop false stops at the ends."
        code={`<Carousel
  index={index}
  onIndexChange={setIndex}
  loop={false}
  label="Feature highlights"
>
  <CarouselSlide>First slide</CarouselSlide>
  <CarouselSlide>Second slide</CarouselSlide>
</Carousel>`}
      >
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
      </Example>

      <Example
        imports="Carousel, CarouselSlide"
        title="Without indicators"
        summary="indicators false hides the dots. size sm shortens the frame."
        code={`<Carousel label="Compact carousel" size="sm" indicators={false}>
  <CarouselSlide>Square slide one</CarouselSlide>
  <CarouselSlide>Square slide two</CarouselSlide>
</Carousel>`}
      >
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
      </Example>

      <Example
        imports="Carousel, CarouselSlide"
        title="Outline and flat"
        summary="outline uses the parent surface. shadow false removes the offset. border false removes the frame stroke."
        code={`<Carousel label="Outline carousel" variant="outline" shadow={false}>
  <CarouselSlide>Outline slide</CarouselSlide>
</Carousel>
<Carousel label="Borderless carousel" border={false}>
  <CarouselSlide>Borderless slide</CarouselSlide>
</Carousel>`}
      >
        <Carousel
          label="Outline carousel"
          variant="outline"
          shadow={false}
          indicators={false}
        >
          <CarouselSlide>
            <div className="flex min-h-32 items-center justify-center px-16 py-8 font-bold uppercase">
              Outline slide
            </div>
          </CarouselSlide>
        </Carousel>
        <Carousel label="Borderless carousel" border={false} indicators={false}>
          <CarouselSlide>
            <div className="flex min-h-32 items-center justify-center px-16 py-8 font-bold uppercase">
              Borderless slide
            </div>
          </CarouselSlide>
        </Carousel>
      </Example>

      <ComponentNotes {...carouselNotes} />
    </Container>
  );
}
