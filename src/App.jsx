import Nav from './components/sections/Nav';
import Hero from './components/sections/Hero';
import Glance from './components/sections/Glance';
import Problem from './components/sections/Problem';
import HowItWorks from './components/sections/HowItWorks';
import Demo from './components/sections/Demo';
import Feasibility from './components/sections/Feasibility';
import { CtaBand, Footer, Outcomes, Pilot, Risks } from './components/sections/Closing';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#demo">Skip to the interactive demo</a>
      <Nav />
      <main>
        <Hero />
        <Glance />
        <Problem />
        <HowItWorks />
        <Demo />
        <Feasibility />
        <Risks />
        <Pilot />
        <Outcomes />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
