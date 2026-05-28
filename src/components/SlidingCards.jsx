import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

const SlidingCards = () => {
  const vlogs = [
    {
      category: "Travel",
      title: "A Morning in Bali",
      description: "A short vlog about sunrise, coffee, and hidden beaches.",
    },
    {
      category: "Food",
      title: "Street Food Tour",
      description: "Discover local flavors and kitchen secrets with every bite.",
    },
    {
      category: "Tech",
      title: "Workspace Makeover",
      description: "See how a creator crafts a productive studio for daily vlogging.",
    },
    {
      category: "Lifestyle",
      title: "Day in the Life",
      description: "A real vlog capturing routine, creativity, and everyday authenticity.",
    },
    {
      category: "Wellness",
      title: "Mindful Mornings",
      description: "A calm story about rituals, journaling, and improving focus.",
    },
  ];

  return (
    <section className="w-full px-6 py-20 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Random Vlogs</p>
          <h2 className="mt-4 text-4xl font-bold">Explore Fresh Vlogs from Creators</h2>
        </div>

        <Swiper
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={1.2}
          spaceBetween={24}
          grabCursor={true}
          loop={true}
          modules={[Autoplay, EffectCoverflow]}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
          }}
        >
          {vlogs.map((vlog, index) => (
            <SwiperSlide key={index} className="p-4">
              <div className="rounded-4xl border border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 h-full hover:-translate-y-2 transition-transform duration-300">
                <span className="inline-block rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  {vlog.category}
                </span>
                <h3 className="mt-6 text-3xl font-bold text-white">{vlog.title}</h3>
                <p className="mt-4 text-slate-400 leading-7">{vlog.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SlidingCards;