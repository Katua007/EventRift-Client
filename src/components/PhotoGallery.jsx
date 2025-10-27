import { ImageWithFallback } from './figma/ImageWithFallback';

export function PhotoGallery() {
  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1649471323554-aa4cb720261c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMG5pZ2h0Y2x1YiUyMGRhbmNpbmd8ZW58MXx8fHwxNzYxNTY1OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Party dancing'
    },
    {
      url: 'https://images.unsplash.com/photo-1759873148521-c49d9497cf64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHZlbnVlJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzYxNTY1OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Event venue'
    },
    {
      url: 'https://images.unsplash.com/photo-1512702530765-acc2a012170d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwYXVkaWVuY2UlMjBoYW5kc3xlbnwxfHx8fDE3NjE1NjU5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Concert audience'
    },
    {
      url: 'https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjE0NzcyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Nightclub lights'
    },
    {
      url: 'https://images.unsplash.com/photo-1561264819-1ccc1c6e0ae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjE1MjU2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Live music'
    },
    {
      url: 'https://images.unsplash.com/photo-1561264819-ec6538dc260e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc2MTQ3ODI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Live band'
    }
  ];

  return (
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
              <ImageWithFallback
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}