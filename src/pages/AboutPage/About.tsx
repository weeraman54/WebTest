import React from "react";

const About: React.FC = () => {
  return (
    <div className="w-full">
      <main className="w-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Geolex</h1>
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-4">
              Welcome to Geolex, your premier destination for quality tech products.
            </p>
            <p className="text-gray-600">
              We specialize in providing the latest technology solutions for all your needs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;