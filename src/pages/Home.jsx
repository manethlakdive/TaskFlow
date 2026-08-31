import { useModal } from "../context/ModalContext";
import HomeNavbar from "../components/layout/HomeNavbar";
import Hero from "../components/common/Hero";
import About from "../components/home/About";
import Footer from "../components/layout/Footer";

export default function Home() {
  const { openModal } = useModal();

  return (
    <div>
      <HomeNavbar />
      <Hero
        heading="COLLABORATIVE TASK MANAGEMENT"
        rotatingTexts={["Plan.", "Organize.", "Achieve."]}
        subtitle="Bring your team, tasks, and projects together in one simple workspace."
        buttonText="Get Started"
        onButtonClick={() => openModal("register")}
      />
      <About />
      <Footer />
    </div>
  );
}