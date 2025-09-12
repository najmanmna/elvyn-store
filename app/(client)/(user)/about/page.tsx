import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const AboutPage = () => {
  return (
    <div className="bg-tech_white">
      <Container className="max-w-6xl lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">About Elvyn</h1>
        
      </Container>
    </div>
  );
};

export default AboutPage;
