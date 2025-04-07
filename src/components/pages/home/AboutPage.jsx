import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';

function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
              <Sidebar />
            </div>
            <div className="flex-l">
              <div className="bg-white border border-blue-200 rounded-xl shadow-sm p-6 ">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">About ResourceBase</h1>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h2>
                  <p className="text-gray-600 mb-4">
                    ResourceBase was created to solve a common problem: the internet is filled with valuable resources, 
                    but finding the right ones can be overwhelming. Our mission is to create a community-driven platform 
                    where people can discover, share, and organize the best learning resources across various fields.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We believe in the power of collective knowledge and curation. By allowing our community to vote, 
                    comment, and organize resources, we ensure that the most valuable content rises to the top, saving 
                    everyone time and enhancing the learning experience.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-700 mb-2">Resource Sharing</h3>
                      <p className="text-gray-600">Share valuable resources with the community and help others learn.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-700 mb-2">Community Voting</h3>
                      <p className="text-gray-600">Vote on resources to help the best content rise to the top.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-700 mb-2">Personal Bookmarks</h3>
                      <p className="text-gray-600">Save resources for later reference in your personal bookmark collection.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-700 mb-2">Topic Organization</h3>
                      <p className="text-gray-600">Find resources by categories and tags that interest you.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Meet the Developer</h2>
                  <div className="flex flex-col md:flex-row items-center md:items-start bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="w-32 h-32 mb-4 md:mb-0 md:mr-6">
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-4xl text-blue-600 font-bold">PB</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Pritom Biswas</h3>
                      <p className="text-gray-600 mb-4">
                        Full Stack Developer passionate about creating useful applications that solve real-world problems.
                        ResourceBase is built with React, Tailwind CSS, and a robust backend to provide a seamless user experience.
                      </p>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Techs used in it:</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Node.js</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Tailwind CSS</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">PostgreSQL</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">JavaScript</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">RESTful APIs</span>
                        </div>
                      </div>
                      <div className="flex justify-center md:justify-start space-x-4">
                        <a href="https://github.com/Pritom2357" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/pritom-biswas-11b098315?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a href="https://www.facebook.com/pritom.biswas.3705157/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    ResourceBase was developed in 2025 as a solution to the information overload problem. As a developer 
                    constantly learning new technologies, I found myslef overwhelmed with bookmarks, 
                    scattered notes, and resources that were hard to find when needed.
                  </p>
                  <p className="text-gray-600 mb-4">
                    This platform was born from that frustration — a centralized, community-driven space where the best 
                    resources could be easily discovered, organized, and shared. What started as a personal project 
                    has evolved into a growing community of knowledge seekers and sharers.
                  </p>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Link
                    to="/create-resource"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start Sharing Resources 
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage;