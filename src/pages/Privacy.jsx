import React, { useRef, useState, useEffect } from 'react';
import { Input, Breadcrumbs, BreadcrumbItem, Image, Card, ScrollShadow } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import privacyBoy from '../assets/privacyBoy.png';

const Privacy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const sectionsRef = useRef({});

  // Privacy policy sections
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `This Privacy Policy describes how OLX ("we," "our," or "us") collects, uses, and shares your personal information when you use our website, mobile application, or services (collectively, the "Services"). We are committed to protecting your privacy and ensuring you have a positive experience when using our Services.`
    },
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us, information we collect automatically when you use the Services, and information from third-party sources. This includes personal information such as your name, email address, phone number, and location data. We also collect information about your interactions with our Services, including browsing history, search queries, and device information.`
    },
    {
      id: 'how-we-use-information',
      title: 'How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our Services, to communicate with you, to develop new products and services, and to protect our users and Services. We may also use your information for marketing purposes, such as sending promotional emails or showing targeted advertisements. We process your personal data based on legitimate interests, consent, contractual necessity, and/or compliance with legal obligations.`
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      content: `We may share your information with third-party service providers, partners, and affiliated companies to help us provide our Services. We may also share information when required by law, to protect rights and safety, or with your consent. We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.`
    },
    {
      id: 'legal',
      title: 'Legal Basis for Processing',
      content: `We process your personal data based on legitimate interests, consent, contractual necessity, and/or compliance with legal obligations. We'll only use your information in ways that are compatible with the purposes for which it was collected or authorized by you. Where required by law, we obtain your consent for the processing of your personal data.`
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      content: `Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data, object to certain processing activities, or withdraw your consent. To exercise these rights, please contact us at privacy@olx.com. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.`
    },
    {
      id: 'data-retention',
      title: 'Data Retention and Security',
      content: `We retain your personal information for as long as necessary to provide our Services, comply with legal obligations, resolve disputes, and enforce our agreements. We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      content: `Your personal information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. However, we take appropriate safeguards to require that your personal information remains protected in accordance with this Privacy Policy.`
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      content: `Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will take steps to delete such information as quickly as possible. If you believe that a child under 16 may have provided us with personal information, please contact us.`
    },
    {
      id: 'changes',
      title: 'Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated Privacy Policy on our website or through other communications. Your continued use of our Services after any changes to this Privacy Policy indicates your agreement with the revised policy.`
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: `If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at privacy@olx.com or by mail at: OLX Privacy Team, 123 Main Street, New York, NY 10001. We are committed to working with you to resolve any complaints or concerns you may have regarding our privacy practices.`
    }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    // Find the first section that matches the search term
    const searchTermLower = searchTerm.toLowerCase();
    const matchedSection = sections.find(section => 
      section.title.toLowerCase().includes(searchTermLower) || 
      section.content.toLowerCase().includes(searchTermLower)
    );

    if (matchedSection && sectionsRef.current[matchedSection.id]) {
      sectionsRef.current[matchedSection.id].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  // Register refs for each section
  useEffect(() => {
    sections.forEach(section => {
      sectionsRef.current[section.id] = document.getElementById(section.id);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Gradient background header */}
      <div 
        className="w-full py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-[#006C54] to-[#CFE9DC] text-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg md:text-xl opacity-90">
              We respect your privacy and are committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src={privacyBoy}
              alt="Privacy"
              className="max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs and search section */}
      <div className=" py-6 px-4 md:px-8 lg:px-16 border-b-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Breadcrumbs>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/privacy" isActive>Privacy Policy</BreadcrumbItem>
            </Breadcrumbs>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search privacy policy..."
                value={searchTerm}
                onChange={handleSearchChange}
                variant='flat'
                shadow='none'
                endContent={
                  <button type="submit" className="focus:outline-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                  </button>
                }
                className="max-w-xs bg-white w-screen"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow py-10 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card 
                key={section.id} 
                id={section.id} 
                className="p-6 border border-gray-200 hover:border-[#006C54] transition-colors"
              >
                <h2 className="text-2xl font-semibold mb-4 text-[#006C54]">{section.title}</h2>
                <p className="text-gray-700">{section.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Last updated */}
      <div className="bg-gray-100 py-6 px-4 md:px-8 lg:px-16 text-center">
        <p className="text-gray-600">
          This Privacy Policy was last updated on June 1, 2023.
        </p>
      </div>
    </div>
  );
};

export default Privacy; 