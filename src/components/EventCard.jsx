export function EventCard({ image, title, date, location }) {
  return (
    <div className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer">
      <div className="h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
        <span className="text-4xl">{image || '🎉'}</span>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-white/60 text-sm mb-1">{date}</p>
        <p className="text-white/60 text-sm">{location}</p>
      </div>
    </div>
  );
}