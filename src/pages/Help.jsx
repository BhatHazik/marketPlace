import React, { useRef, useState, useEffect } from 'react';
import { Input, Breadcrumbs, BreadcrumbItem, Image, Accordion, AccordionItem } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import helpGirl from '../assets/helpGirl.png';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const sectionsRef = useRef({});

  // FAQ categories and questions
  const faqSections = [
    {
      id: 'account',
      title: 'Account & Registration',
      faqs: [
        {
          id: 'create-account',
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Login" button in the top right corner and then select "Register". You can sign up using your email address, phone number, or Google account. Follow the on-screen instructions to complete your registration.'
        },
        {
          id: 'forgot-password',
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click on the "Login" button, then select "Forgot Password". Enter the email address or phone number associated with your account, and we\'ll send you instructions to reset your password.'
        },
        {
          id: 'delete-account',
          question: 'How can I delete my account?',
          answer: 'To delete your account, go to your profile settings, scroll to the bottom, and click on "Delete Account". Please note that this action cannot be undone, and all your data will be permanently removed from our systems.'
        }
      ]
    },
    {
      id: 'posting',
      title: 'Posting Ads',
      faqs: [
        {
          id: 'post-ad',
          question: 'How do I post an ad?',
          answer: 'To post an ad, click on the "+ Post Ad" button at the top of the page. Select the appropriate category for your item, fill out the required details, upload photos, set your price, and submit. Your ad will be reviewed and published shortly.'
        },
        {
          id: 'edit-ad',
          question: 'Can I edit my ad after posting?',
          answer: 'Yes, you can edit your ad after posting. Go to your profile, find the ad you want to edit under "My Ads", and click on "Edit". Make the necessary changes and save your updates.'
        },
        {
          id: 'delete-ad',
          question: 'How do I delete my ad?',
          answer: 'To delete your ad, go to your profile, find the ad under "My Ads", and click on "Delete". Confirm your action, and the ad will be removed from our platform.'
        },
        {
          id: 'ad-photos',
          question: 'How many photos can I upload for my ad?',
          answer: 'You can upload up to 10 photos for each ad. We recommend using clear, high-quality images taken in good lighting to showcase your item effectively.'
        }
      ]
    },
    {
      id: 'buying',
      title: 'Buying & Contacting Sellers',
      faqs: [
        {
          id: 'contact-seller',
          question: 'How do I contact a seller?',
          answer: 'To contact a seller, navigate to the ad listing and click on the "Chat" or "Call" button. You can send messages directly through our platform or make a call if the seller has provided their phone number.'
        },
        {
          id: 'payment-methods',
          question: 'What payment methods can I use?',
          answer: 'OLX is primarily a classifieds platform that connects buyers and sellers. Payment methods are arranged between the buyer and seller directly. We recommend using secure payment methods and meeting in safe, public locations for in-person transactions.'
        },
        {
          id: 'safe-buying',
          question: 'How can I ensure a safe buying experience?',
          answer: 'To ensure a safe buying experience, we recommend: meeting in public places for transactions, inspecting items thoroughly before purchasing, avoiding wire transfers to unknown individuals, using secure payment methods, and trusting your instincts if something seems suspicious.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      faqs: [
        {
          id: 'reporting',
          question: 'How do I report a suspicious ad or user?',
          answer: 'To report a suspicious ad, click on the "Report" button on the ad listing. To report a user, go to their profile and click on "Report User". Provide as much information as possible about the issue, and our team will investigate promptly.'
        },
        {
          id: 'safe-meetups',
          question: 'What are the safety tips for meeting buyers/sellers?',
          answer: 'Always meet in public, well-lit locations during daylight hours. Bring a friend if possible. Let someone know where you\'re going. For high-value items, consider meeting at a police station or bank. Trust your instincts and leave if you feel uncomfortable.'
        },
        {
          id: 'avoid-scams',
          question: 'How can I avoid scams?',
          answer: 'Be wary of deals that seem too good to be true. Never send money in advance or make wire transfers to unknown individuals. Don\'t share personal financial information. Be suspicious of sellers who refuse to meet in person or show the item. Use our messaging system instead of taking communication off-platform.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      faqs: [
        {
          id: 'app-issues',
          question: 'The app is not working. What should I do?',
          answer: 'If you\'re experiencing issues with our app, try the following: restart the app, check your internet connection, clear the app cache, ensure you\'re using the latest version, or reinstall the app. If problems persist, please contact our customer support.'
        },
        {
          id: 'browser-issues',
          question: 'I\'m having trouble using the website. What should I do?',
          answer: 'If you\'re having issues with our website, try clearing your browser cache, using a different browser, disabling browser extensions, or checking your internet connection. Make sure your browser is updated to the latest version.'
        },
        {
          id: 'login-issues',
          question: 'I can\'t log in to my account. What should I do?',
          answer: 'If you can\'t log in, check that you\'re using the correct email or phone number and password. Try resetting your password. If you\'re still having issues, contact our customer support with your account details for assistance.'
        }
      ]
    },
    {
      id: 'business',
      title: 'Business Accounts & Advertising',
      faqs: [
        {
          id: 'business-account',
          question: 'How do I set up a business account?',
          answer: 'To set up a business account, register as usual, then navigate to your profile settings and select "Upgrade to Business Account". You\'ll need to provide your business information, including business name, address, and contact details. Once approved, you\'ll have access to additional features.'
        },
        {
          id: 'advertising',
          question: 'How can I advertise my business on OLX?',
          answer: 'We offer various advertising options for businesses, including featured ads, banner ads, and sponsored content. Contact our advertising team at advertise@olx.com for information on advertising packages, pricing, and customized solutions for your business.'
        },
        {
          id: 'premium-listing',
          question: 'What are premium listings and how do they work?',
          answer: 'Premium listings are ads that receive higher visibility on our platform. Your ad will appear at the top of search results and category pages, feature a highlighted border, and include a "Featured" label. You can upgrade any ad to a premium listing from your account for a small fee.'
        }
      ]
    }
  ];

  // Flatten all FAQs for search
  const allFaqs = faqSections.flatMap(section => 
    section.faqs.map(faq => ({
      ...faq,
      sectionId: section.id
    }))
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    // Find the first FAQ that matches the search term
    const searchTermLower = searchTerm.toLowerCase();
    const matchedFaq = allFaqs.find(faq => 
      faq.question.toLowerCase().includes(searchTermLower) || 
      faq.answer.toLowerCase().includes(searchTermLower)
    );

    if (matchedFaq) {
      const sectionElement = document.getElementById(matchedFaq.sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start' 
        });
        
        // Expand the accordion item
        const accordionItem = document.getElementById(matchedFaq.id);
        if (accordionItem) {
          // Use setTimeout to ensure scrolling completes first
          setTimeout(() => {
            // Find and click the button to expand the accordion
            const button = accordionItem.querySelector('button');
            if (button) button.click();
          }, 500);
        }
      }
    }
  };

  // Register refs for each section
  useEffect(() => {
    faqSections.forEach(section => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-lg md:text-xl opacity-90">
              Find answers to common questions and learn how to get the most out of OLX.
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src={helpGirl}
              alt="Help Center"
              className="max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs and search section */}
      <div className="py-6 px-4 md:px-8 lg:px-16 border-b-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Breadcrumbs>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/help" isActive>Help Center</BreadcrumbItem>
            </Breadcrumbs>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search for help..."
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
            {faqSections.map((section, index) => (
              <div 
                key={section.id} 
                id={section.id} 
                className="border border-gray-200 rounded-xl p-6 hover:border-[#006C54] transition-colors"
              >
                <h2 className="text-2xl font-semibold mb-6 text-[#006C54]">{section.title}</h2>
                <Accordion
                  variant="bordered"
                  selectionMode="multiple"
                  showDivider={true}
                  className="gap-2"
                >
                  {section.faqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      id={faq.id}
                      title={faq.question}
                      classNames={{
                        title: "text-default-700 text-md",
                        content: "text-sm text-default-600"
                      }}
                    >
                      {faq.answer}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-gray-100 py-10 px-4 md:px-8 lg:px-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer to your question, our support team is here to help you.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="mailto:support@olx.com" 
              className="px-6 py-3 bg-[#006C54] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Email Support
            </a>
            <a 
              href="tel:+1234567890" 
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 