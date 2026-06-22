import { DangelNav } from "./components/DangelNav";
import { DangelHero } from "./components/DangelHero";
import { DangelBienfaits } from "./components/DangelBienfaits";
import { DangelServices } from "./components/DangelServices";
import { DangelProcess } from "./components/DangelProcess";
import { DangelAPropos } from "./components/DangelAPropos";
import { DangelTestimonials } from "./components/DangelTestimonials";
import { DangelFaq } from "./components/DangelFaq";
import { DangelContact } from "./components/DangelContact";
import { DangelCTAFinal } from "./components/DangelCTAFinal";
import { DangelFooter } from "./components/DangelFooter";

export default function App() {
  return (
    <div
      style={{ backgroundColor: "#F7F4EE", minHeight: "100vh" }}
    >
      <DangelNav />
      <DangelHero />
      <DangelBienfaits />
      <DangelServices />
      <DangelProcess />
      <DangelAPropos />
      <DangelTestimonials />
      <DangelFaq />
      <DangelContact />
      <DangelCTAFinal />
      <DangelFooter />
    </div>
  );
}