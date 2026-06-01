import NavBar from "../components/NavBar";

const Contact = () => (
  <div className="min-h-screen bg-rentease-dark">
    <NavBar />
    <section className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold text-rentease-yellow mb-4">Contact</h1>
      <p className="text-rentease-light">Email: support@rentease.in</p>
      <p className="text-rentease-light mt-2">Phone: +91 98765 43210</p>
    </section>
  </div>
);

export default Contact;
