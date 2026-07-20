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

export default function App() {
  return (
    <div className="min-h-screen">
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
