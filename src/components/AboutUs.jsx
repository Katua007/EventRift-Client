import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutUs() {
  return (
    <section className="bg-er-dark py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-8 text-center">
          About EventRift
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] overflow-hidden rounded-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1727096857692-e9dadf2bc92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwc3RhZ2V8ZW58MXx8fHwxNzYxNTU5MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Concert crowd at music festival"
              className="w-full h-full object-cover rounded-xl"
              fallback="🎵"
            />
          </div>
          
          <div className="text-er-light space-y-6">
            <div>
              <h3 className="font-heading text-2xl font-semibold text-er-primary mb-4">
                Connecting Kenya Through Events
              </h3>
              <p className="text-er-text text-lg leading-relaxed">
                EventRift is Kenya's premier platform where people can discover, plan, and organize unforgettable events. 
                From intimate gatherings to massive festivals, we connect communities through shared experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading text-xl font-semibold text-er-light mb-3">Our Mission</h4>
              <p className="text-er-text leading-relaxed">
                To revolutionize how Kenyans experience events by providing a seamless platform that brings 
                organizers and attendees together, fostering connections and creating lasting memories.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-er-primary">500+</div>
                <div className="text-er-text text-sm">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-er-secondary">10K+</div>
                <div className="text-er-text text-sm">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}