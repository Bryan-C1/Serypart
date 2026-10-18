import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import WhyUs from "../components/WhyUs";
import Process from "../components/Process";
import Gallery from "../components/Gallery";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "#FFFFFF", color: "#111111" }}>
      <Header />
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <Gallery />
      <CallToAction />
      <Footer />
    </div>
  );
}
