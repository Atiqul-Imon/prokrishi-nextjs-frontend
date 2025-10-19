import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us - Prokrishi",
  description: "Get in touch with Prokrishi for any questions, support, or feedback.",
};

const ContactPage = () => {
  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Contact Us</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
                    We're here to help! Whether you have a question about our products or need assistance with an order, please reach out.
                </p>
            </div>

            <ContactClient />
        </div>
    </div>
  );
};

export default ContactPage; 