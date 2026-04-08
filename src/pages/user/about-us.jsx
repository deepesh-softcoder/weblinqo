const About = () => {
  return (
    <div className="min-h-screen bg-offWhite">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          {/* About page content */}
          <h1 className="text-4xl font-black text-gray-900 mb-6">About us</h1>
          <p className="mb-6 text-gray-600 leading-loose">
          Weblinqo is a modern platform designed to give everyone — creators, entrepreneurs, and small businesses — the power to build their own digital presence with ease.<br />
          From a simple link-in-bio page to advanced AI-powered websites, Weblinqo brings your online identity to life in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;