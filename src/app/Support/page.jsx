"use client";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { Link, Element, animateScroll as scroll } from "react-scroll";

const helpSections = [
  {
    title: "Getting started",
    items: ["Account Creation", "User Onboarding", "Platform Navigation"],
  },
  {
    title: "Account Setup and Management",
    items: [
      "Troubleshooting and Technical Support",
      "Billing and Payment",
      "Privacy and Security",
      "Fraud and Protection",
      "Frequently Asked Questions (FAQs)",
    ],
  },
];

const contentData = {
  "Account Creation": [
    "Visit our website and click on the 'Sign Up' or 'Create Account' button.",
    "Fill in the required information, such as your name, email address, and password.",
    "Follow the verification process, which may include confirming your email or phone number.",
  ],
  "User Onboarding": [
    "Once you have created your account, you will be guided through the onboarding process.",
    "Familiarize yourself with the platform's layout and navigation.",
    "Explore the different features and functionalities available to you.",
  ],
  "Platform Navigation": [
    "Take a tour of the main menu and sub-menu options to understand how to navigate through the platform.",
    "Pay attention to the organization of content and tools for easy access.",
    "Utilize search functionality to find specific features, settings, or information.",
  ],
  "Troubleshooting and Technical Support": [
    "Check the Help Center for guides and troubleshooting tips.",
    "Contact technical support if you encounter any issues.",
  ],
  "Billing and Payment": [
    "View and manage your billing information in your account settings.",
    "Contact support for any billing-related inquiries.",
  ],
  "Privacy and Security": [
    "Review our privacy policy to understand how your data is handled.",
    "Adjust your privacy settings in your account.",
  ],
  "Fraud and Protection": [
    "Learn about our fraud prevention measures.",
    "Report any suspicious activity to our support team.",
  ],
  "Frequently Asked Questions (FAQs)": [
    "Visit the FAQs section for answers to common questions.",
    "Contact support if you need further assistance.",
  ],
};

function SupportPage() {
  const [activeSubSection, setActiveSubSection] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-10">
        <h1 className="text-xl font-bold text-gray-800">HungryMonk</h1>
        <a href="/" className="text-indigo-600">
          Go back to main page
        </a>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-8 shadow rounded">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Help Centre
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
            We understand that sometimes you may encounter difficulties or have
            questions while using our platform, and we're here to assist you
            every step of the way.
          </p>

          <div className="flex items-center mb-6 p-10 max-w-3xl mx-auto space-x-2">
            <input
              type="text"
              placeholder="Type a keyword"
              className="flex-grow p-2 border border-gray-300 rounded-l rounded"
            />
            <select className="border border-gray-300 p-2 rounded">
              <option>General</option>
            </select>
            <button className="bg-indigo-600 text-white p-2 rounded">
              Find query
            </button>
          </div>

          <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center w-1/3">
              <div className="bg-red-100 p-4 rounded-full mb-2">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 7h-3V3a1 1 0 10-2 0v4H7a1 1 0 000 2h1v3H7a1 1 0 100 2h1v4a1 1 0 102 0v-4h3a1 1 0 100-2h-3V9h3a1 1 0 100-2zM9 7h2V5H9v2zm0 4h2V9H9v2z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Fraud and Protection</p>
              <p className="text-gray-500 text-sm text-center">
                We are committed to ensuring the security and integrity of our
                website and protecting our users.
              </p>
            </div>
            <div className="flex flex-col items-center w-1/3">
              <div className="bg-green-100 p-4 rounded-full mb-2">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-9h-2v4h4v-2h-2V7zm-2 8h2v-2h-2v2z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Privacy and Security</p>
              <p className="text-gray-500 text-sm text-center">
                Protecting your privacy and ensuring the security of your
                personal information is of utmost importance to us.
              </p>
            </div>
            <div className="flex flex-col items-center w-1/3">
              <div className="bg-indigo-100 p-4 rounded-full mb-2">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 5a4 4 0 118 0 4 4 0 01-8 0zM4 10a6 6 0 1112 0v1a5.98 5.98 0 00-6 6H8a6 6 0 00-4-5.6V10zm4 6a5.98 5.98 0 004-5.6V10a6 6 0 10-8 0v1a5.98 5.98 0 004 5.6z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Managing my account</p>
              <p className="text-gray-500 text-sm text-center">
                We are here to provide you with the information and assistance
                you need to effectively manage your account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <nav>
                {helpSections.map((section) => (
                  <Disclosure key={section.title}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-indigo-900 rounded-lg hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                          <span>{section.title}</span>
                          {open ? (
                            <MdKeyboardArrowUp className="w-5 h-5 text-indigo-500" />
                          ) : (
                            <MdKeyboardArrowDown className="w-5 h-5 text-indigo-500" />
                          )}
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                          <ul>
                            {section.items.map((item) => (
                              <li
                                key={item}
                                className={`cursor-pointer pl-4 text-gray-700 hover:text-gray-900 ${
                                  activeSubSection === item ? "font-bold" : ""
                                }`}
                              >
                                <Link
                                  to={item}
                                  smooth={true}
                                  duration={500}
                                  onClick={() => setActiveSubSection(item)}
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </nav>
            </div>
            <div className="md:col-span-2">
              {Object.keys(contentData).map((subSection) => (
                <Element
                  key={subSection}
                  name={subSection}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {subSection}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {contentData[subSection]?.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    )) || (
                      <p className="text-gray-600">
                        Select a topic from the left panel to see details here.
                      </p>
                    )}
                  </ol>
                </Element>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Having trouble finding what you're searching for?
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
              Connect to support
            </button>
          </div>
        </div>  
      </main>

      <footer className="w-full h-16 bg-white flex items-center justify-center border-t">
        <p className="text-gray-600">© 2023 HungryMonk, Inc.</p>
      </footer>
    </div>
  );
}

export default SupportPage;
