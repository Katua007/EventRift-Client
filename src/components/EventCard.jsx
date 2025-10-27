import { ImageWithFallback } from './figma/ImageWithFallback';

export function EventCard({ image, title, date, location }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 aspect-[3/4]">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="text-white">
        <p className="text-sm text-white/60 mb-1">{date}</p>
        <p className="text-sm text-white/60">{location}</p>
      </div>
    </div>
  );
}