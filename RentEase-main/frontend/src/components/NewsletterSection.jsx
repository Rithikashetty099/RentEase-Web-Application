import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { subscribeNewsletter } from "../service/apiSubscribe";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const subscribeMutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: () => {
      toast.success("Thanks for subscribing to RentEase updates.");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message || "Unable to subscribe right now.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    subscribeMutation.mutate({ email: email.trim() });
  };

  return (
    <section className="bg-rentease-black py-16 border-y border-rentease-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-rentease-gray border border-rentease-lightgray p-8 md:p-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="heading-secondary text-white mb-2">
                Newsletter <span className="text-rentease-yellow">Subscribe</span>
              </h2>
              <p className="text-gray-300">
                Get new listings and platform updates in your inbox.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-4 py-3 bg-rentease-dark border border-rentease-lightgray text-white placeholder-gray-400 focus:border-rentease-yellow focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="btn-primary px-6 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
