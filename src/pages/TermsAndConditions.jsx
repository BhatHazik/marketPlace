import React from 'react';
import { Card, Button, ScrollShadow } from '@heroui/react';

const TermsAndConditions = () => {
  const handleCancel = () => {
    // Navigate back or close modal
    window.history.back();
  };

  const handleAgree = () => {
    // Handle agreement logic
    window.history.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#CFE9DC]">
      <Card className="w-full max-w-2xl mx-4 p-6">
        <h1 className="text-2xl font-semibold mb-1">
          <span className="text-black">Terms and </span>
          <span className="text-[#006C54]">Conditions</span>
        </h1>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Your Agreement</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Last Revised: December 15, 2023</p>
          
          <ScrollShadow className="h-72 mb-4" hideScrollBar={false}>
            <div className="text-sm text-gray-700 space-y-4">
              <p>
                Welcome to www.olx.info. This site is provided as a service to our visitors and may be used for informational purposes only.
                Because the Terms and Conditions contain legal obligations, please read them carefully.
              </p>
              <p className="font-semibold">1. YOUR AGREEMENT</p>
              <p>
                By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these
                Terms and Conditions, please do not use this site.
              </p>
              <p className="font-semibold">PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time.
                Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically.
                Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms
                and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
              </p>
              <p className="font-semibold">2. PRIVACY</p>
              <p>
                Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
              </p>
              <p className="font-semibold">3. LINKED SITES</p>
              <p>
                This Site may contain links to other independent third-party Web sites ("Linked Sites"). These Linked Sites are provided solely as a convenience to our visitors
                and are not under our control. Such Linked Sites are not controlled by us, and we are not responsible for and do not endorse the content of such Linked Sites, 
                including any information or materials contained on such Linked Sites. You will need to make your own independent judgment regarding your interaction with these Linked Sites.
              </p>
              <p className="font-semibold">4. INTELLECTUAL PROPERTY</p>
              <p>
                All content on this Site, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, 
                data compilations, and software, is the property of the Company or its content suppliers and protected by international copyright laws.
              </p>
              <p className="font-semibold">5. DISCLAIMER OF WARRANTIES</p>
              <p>
                ALL CONTENT, PRODUCTS, AND SERVICES ON THE SITE, OR OBTAINED FROM A WEBSITE TO WHICH THE SITE IS LINKED ARE PROVIDED "AS IS" WITHOUT 
                WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
                PARTICULAR PURPOSE.
              </p>
              <p className="font-semibold">6. LIMITATION OF LIABILITY</p>
              <p>
                THE COMPANY'S ENTIRE LIABILITY, AND YOUR EXCLUSIVE REMEDY, IN LAW, IN EQUITY, OR OTHERWISE, WITH RESPECT TO THE WEBSITE CONTENT AND 
                SERVICES AND/OR FOR ANY BREACH OF THIS AGREEMENT IS SOLELY LIMITED TO THE AMOUNT YOU PAID, LESS SHIPPING AND HANDLING, FOR PRODUCTS 
                PURCHASED VIA THE WEBSITE.
              </p>
            </div>
          </ScrollShadow>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            className="bg-white text-gray-700 border border-gray-300" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#006C54] text-white" 
            onClick={handleAgree}
          >
            Agree
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TermsAndConditions; 