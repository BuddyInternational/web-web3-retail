import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// import required modules
import { Pagination ,Autoplay} from 'swiper/modules';

const ImageCarousel: React.FC = () => {
  const images = [
    { src: '/v1.jpeg', alt: 'Carousel Item 1' },
    { src: '/v2.jpg', alt: 'Carousel Item 2' },
    { src: '/v3.png', alt: 'Carousel Item 3' },
    { src: '/v4.jpeg', alt: 'Carousel Item 4' },
    { src: '/v5.png', alt: 'Carousel Item 5' },
    { src: '/v6.jpeg', alt: 'Carousel Item 6' },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full h-96 sm:h-52 md:h-72 lg:h-80 xl:h-[400px]">
      <Swiper
        slidesPerView={3}  // Display 3 images at a time
        spaceBetween={20}   // Space between slides
        pagination={{ clickable: true }}
        modules={[Pagination,Autoplay]}
        autoplay={{
          delay: 2500, // Delay between transitions in milliseconds
          disableOnInteraction: false, // Allows autoplay to continue after user interactions
        }}
        onSlideChange={(swiper:any) => setActiveIndex(swiper.activeIndex)}
        breakpoints={{
          // Custom breakpoints according to your Tailwind configuration
          320: {
            slidesPerView: 1, // sm: 320px - 1 slide
          },
          768: {
            slidesPerView: 2, // md: 768px - 2 slides
          },
          1024: {
            slidesPerView: 3, // lg: 1024px - 3 slides
          },
          1280: {
            slidesPerView: 3, // xl: 1280px - 4 slides
          },
          1536: {
            slidesPerView: 4, // 2xl: 1536px - 5 slides
          },
        }}
        className="h-[400px]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <img
              src={image.src}
              alt={image.alt}
              // className="object-cover rounded-lg w-full h-60"
              className={`object-cover rounded-lg w-full h-60 transition duration-500${
                index === activeIndex ? 'opacity-80' : 'opacity-0'
              }`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
