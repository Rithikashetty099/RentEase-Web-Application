import NavBar from "../components/NavBar";

const About = () => (
  <div className="min-h-screen bg-rentease-dark">
    <NavBar />
    <section className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold text-rentease-yellow mb-4">About RentEase</h1>
      <p className="text-rentease-light leading-7">
        RentEase is a trusted multi-category rental marketplace for properties, vehicles, electronics,
        furniture, tools and equipment, agriculture equipment, and sports and recreation items.
        Our focus is simple: make renting fast, transparent, and reliable.
      </p>
    </section>
  </div>
);

export default About;
