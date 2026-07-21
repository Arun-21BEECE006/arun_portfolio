import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Conferences from "./components/Conferences";
import Achievements from "./components/Achievements";
import OpenSourceActivity from "./components/OpenSourceActivity";
import ResumeSection from "./components/ResumeSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import LoadingScreen from "./components/LoadingScreen";
import { useContent } from "./context/ContentContext";

export default function App() {
  const { loading } = useContent();

  // Wait for real content to load before rendering anything — this avoids
  // ever flashing the bundled fallback data first and then swapping to
  // your actual live data a moment later.
  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Conferences />
        <Achievements />
        <OpenSourceActivity />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
