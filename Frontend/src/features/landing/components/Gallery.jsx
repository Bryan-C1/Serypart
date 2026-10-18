import { Search } from "lucide-react";
import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";
import SectionHeading from "./SectionHeading";

const GALLERY = [
  {
    img: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tall: true,
  },
  {
    img: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tall: false,
  },
  {
    img: "https://images.unsplash.com/photo-1727893119356-1702fe921cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tall: false,
  },
  {
    img: "https://images.unsplash.com/photo-1775687902926-3244299ee7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tall: true,
  },
  {
    img: "https://images.unsplash.com/photo-1645445522156-9ac06bc7a767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tall: false,
  },
  {
    img: "https://images.unsplash.com/photo-1504222490345-c075b6008014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tall: false,
  },
];

export default function Gallery() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Nuestro taller"
          title="Galería"
          subtitle="Instalaciones modernas y equipadas para darte el mejor servicio."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((item, i) => (
            <div
              key={item.img}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                item.tall ? "row-span-2" : ""
              }`}
              style={{ height: item.tall ? 420 : 200 }}
            >
              <ImageWithFallback
                src={item.img}
                alt={`Galería SeryPart ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ backgroundColor: "rgba(37,99,235,0.6)" }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5" style={{ color: "#2563EB" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}