import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1709731191876-899e32264420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NjE1NjU5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Concert crowd"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="mb-6 tracking-wide uppercase text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            World of live experiences<br />
            where every event tells a story<br />
            and every story becomes a memory
          </h1>
          <p className="text-white/80 text-lg md:text-xl">Unforgettable events</p>
        </div>
      </div>
    </div>
  );
}