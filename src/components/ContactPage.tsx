import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Phone, Mail } from "lucide-react";

const contactDetails = [
  {
    icon: Phone,
    title: "Call Us",
    lines: ["(555) 123-MEAT", "(555) 123-6328"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["orders@steakout.com", "info@steakout.com"],
  },
];

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero — matches Menu page */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="/contact/Contact.png"
          alt="Steak-Out contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-medium mb-4 drop-shadow-lg">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Questions, custom orders, or bulk pricing — we&apos;re here to help.
            </p>
          </div>
        </div>
      </div>

      {/* Contact form + details */}
      <section className="py-16 md:py-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="bg-white rounded-[8px] border-2 border-black p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-2">
              Send a Message
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Tell us about your order, preferred cuts, or any special requirements.
            </p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A] h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A] h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A] h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A] h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Custom order inquiry"
                  className="bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A] h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your meat needs, preferred cuts, or any special requirements..."
                  rows={5}
                  className="bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A] resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-10 h-12 text-base font-medium rounded-[6px] transition-colors hover:bg-[#1a1a1a]"
                style={{ backgroundColor: "#0B0B0B", color: "white" }}
              >
                Send Message
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactDetails.map(({ icon: Icon, title, lines }) => (
              <div
                key={title}
                className="bg-white rounded-[8px] border-2 border-black p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EE101A]/10 text-[#EE101A]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h2>
                  <div className="space-y-1">
                    {lines.map((line) => (
                      <p key={line} className="text-gray-600 text-sm leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
