export function EventCard({ image, title, date, location }) {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer">
      <div className="h-48 relative bg-gradient-to-br from-purple-500/30 to-pink-500/30">
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center" style={{ display: 'none' }}>
              <span className="text-white font-semibold">No Image</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white font-semibold">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-white/60 text-sm mb-1">{date}</p>
        <p className="text-white/60 text-sm">{location}</p>
      </div>
    </div>
  );
}