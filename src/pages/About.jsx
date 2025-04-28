import { Card, CardBody, CardHeader, Image } from '@heroui/react'
import React, { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import aboutHero from '../assets/aboutHero.jpg'
import aboutGirl from '../assets/aboutgirl.jpg'
import aboutBoy from '../assets/aboutboy.jpg'
import aboutCarInterior from '../assets/aboutCarInterior.jpg'
import aboutScooter from '../assets/aboutScooter.jpg'
import aboutTeam from '../assets/aboutTeam.jpg'

const About = () => {
  const heroRef = useRef(null)
  const infoRef = useRef(null)
  const girlRef = useRef(null)
  const cardRef = useRef(null)
  const boyRef = useRef(null)
  const connectingRef = useRef(null)
  const standForRef = useRef(null)
  const imagesRef = useRef(null)
  const teamRef = useRef(null)
  const whyChooseRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const infoInView = useInView(infoRef, { once: true, amount: 0.3 })
  const girlInView = useInView(girlRef, { once: true, amount: 0.3 })
  const cardInView = useInView(cardRef, { once: true, amount: 0.3 })
  const boyInView = useInView(boyRef, { once: true, amount: 0.3 })
  const connectingInView = useInView(connectingRef, { once: true, amount: 0.3 })
  const standForInView = useInView(standForRef, { once: true, amount: 0.3 })
  const imagesInView = useInView(imagesRef, { once: true, amount: 0.3 })
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 })
  const whyChooseInView = useInView(whyChooseRef, { once: true, amount: 0.2 })

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <motion.div 
        className='bg-white flex justify-center items-center py-6 md:h-20'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-black text-2xl md:text-4xl font-semibold'>About Us</h1>
      </motion.div>

      <div 
        ref={heroRef}
        className='min-h-[70vh] md:h-[calc(100vh-5rem)] relative w-full bg-black overflow-hidden'
      >
        <div className='opacity-50 overflow-hidden h-full w-full absolute inset-0'>
      <Image 
        src={aboutHero}
        removeWrapper
        alt='Hero'
            className='object-cover w-full h-full'
        radius='none'
      />
        </div>

        <motion.div 
          ref={infoRef}
          className='absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 z-10'
          initial={{ opacity: 0, y: 30 }}
          animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 w-full md:w-3/4'
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
          Welcome to OLX – Connecting Buyers and Sellers with Trust and Ease
          </motion.h1>
          <motion.h3 
            className='text-lg md:text-xl'
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
          A Smart, Secure, and Seamless Marketplace for Everyone.
          </motion.h3>
        </motion.div>
      </div>

      <div className='flex flex-col bg-white'>
        <div className=' py-10 md:h-[50%] flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 px-4'>
          <motion.div 
            ref={girlRef}
            className='w-full sm:w-[80%] md:w-[20%] h-60 md:h-full relative mb-6 md:mb-0'
            initial={{ opacity: 0, x: -50 }}
            animate={girlInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <div className='relative h-full w-full overflow-hidden rounded-xl shadow-lg'>
              <Image src={aboutGirl} className='h-full w-full object-cover' removeWrapper/>
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='border-2 border-white w-[85%] h-[85%] rounded-lg'></div>
      </div>
    </div>
          </motion.div>

          <motion.div 
            ref={cardRef}
            className='w-full sm:w-[80%] md:w-[20%] h-auto md:h-full mb-6 md:mb-0'
            initial={{ opacity: 0, y: 50 }}
            animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className='h-full bg-[#CFE9DC]' shadow='none'>
                    <CardHeader>
                <span className='flex gap-1 text-2xl md:text-3xl w-full justify-center pt-2 font-[600]'>
                  <h1>About</h1><h1 className='text-[#006C54]'>Us</h1>
                </span>
                    </CardHeader>
                    <CardBody className='w-full flex items-center'>
                <p className='align-self-center w-[90%] font-[400] text-base md:text-lg'>
OLX connects buyers and sellers through a secure, easy-to-use marketplace. We make buying and selling simple, fast, and reliable for everyone.
                        </p>
                    </CardBody>
                </Card>
          </motion.div>

          <motion.div 
            ref={boyRef}
            className='w-full sm:w-[80%] md:w-[20%] h-60 md:h-full relative'
            initial={{ opacity: 0, x: 50 }}
            animate={boyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className='relative h-full w-full overflow-hidden rounded-xl shadow-lg'>
              <Image src={aboutBoy} className='h-full w-full object-cover' removeWrapper/>
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='border-2 border-white w-[85%] h-[85%] rounded-lg'></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Connecting Communities Section */}
      <div className='py-16 px-4 md:px-8 lg:px-16 bg-white'>
        <motion.div 
          ref={connectingRef}
          className='text-center max-w-4xl mx-auto mb-10'
          initial={{ opacity: 0, y: 30 }}
          animate={connectingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-[400] mb-4'>
            Connecting Communities Through Smart <span className='text-[#006C54]'>Buying & Selling</span>
          </h2>
          <p className='text-gray-700 text-sm md:text-base lg:text-lg max-w-xl mx-auto'>
            At OLX, we simplify buying and selling by providing a secure, 
            user-friendly platform. Our commitment to innovation ensures 
            a seamless and trustworthy marketplace for everyone.
          </p>
        </motion.div>

        <div className='mt-10 flex flex-col lg:flex-row gap-8 lg:gap-16'>
          <motion.div 
            ref={standForRef}
            className='flex-1'
            initial={{ opacity: 0, x: -50 }}
            animate={standForInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className='text-2xl md:text-5xl font-[400] mb-4'>
              What We <span className='text-[#006C54]'>Stand</span> For
            </h3>
            <p className='text-gray-700 mb-6'>
              At OLX, we are committed to creating a secure, 
              convenient, and user-friendly marketplace that 
              empowers buyers and sellers to connect with 
              confidence.
            </p>
            <ul className='space-y-3'>
              <li className='flex items-start gap-2'>
                <span className='text-[#006C54] font-bold mt-1'>✓</span>
                <span>We prioritize trust and safety in every deal.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-[#006C54] font-bold mt-1'>✓</span>
                <span>A hassle-free platform for quick and smooth transactions.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-[#006C54] font-bold mt-1'>✓</span>
                <span>From electronics to vehicles, real estate, and more.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-[#006C54] font-bold mt-1'>✓</span>
                <span>Helping people find great deals and new opportunities.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            ref={imagesRef}
            className='flex-1 flex flex-col sm:flex-row gap-4'
            initial={{ opacity: 0, x: 50 }}
            animate={imagesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <Card className='flex-1 overflow-hidden shadow-md h-60 sm:h-auto'>
              <Image
                src={aboutCarInterior} // Placeholder - would be car interior image
                alt="Car Interior"
                className="w-full h-full object-cover"
                removeWrapper
              />
            </Card>
            <Card className='flex-1 overflow-hidden shadow-md h-60 sm:h-auto'>
              <Image
                src={aboutScooter} // Placeholder - would be motorcycle/scooter image
                alt="Motorcycle"
                className="w-full h-full object-cover"
                removeWrapper
              />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className='py-16 flex justify-center items-center bg-white'>
        <motion.div 
          ref={teamRef}
          className='w-[95%] bg-[#CFE9DC] rounded-2xl overflow-hidden'
          initial={{ opacity: 0, y: 50 }}
          animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className='flex flex-col p-8 md:p-12'>
            <div className='text-center mb-8 md:mb-10'>
              <h2 className='text-3xl md:text-5xl font-[400] mb-4'>
                Our Dedicated <span className='text-[#006C54]'>Team</span>
              </h2>
              <p className='text-gray-700 max-w-3xl mx-auto md:text-lg'>
                At OLX, our passionate and skilled team works tirelessly to create a seamless and secure 
                marketplace. With a commitment to innovation, trust, and customer satisfaction, we strive to 
                provide the best buying and selling experience for our users.
              </p>
                    </div>
            
            <div className='flex items-center justify-center py-4'>
              <Card className='w-full md:w-[95%] overflow-hidden rounded-xl shadow-lg'>
                <Image 
                  src={aboutTeam} // Replace with actual team image
                  alt="OLX Team"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  removeWrapper
                />
                </Card>
            </div>
        </div>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <div className='py-16 px-4 md:px-8 lg:px-16 bg-white'>
        <motion.div 
          ref={whyChooseRef}
          className='max-w-6xl mx-auto'
          initial={{ opacity: 0, y: 50 }}
          animate={whyChooseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className='text-center mb-8'>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-[400] mb-4'>
              Why Choose <span className='text-[#006C54]'>Us</span>
            </h2>
            <p className='text-gray-700 max-w-2xl mx-auto'>
              Buy and sell with ease on OLX. Enjoy a secure, user-friendly
              platform with verified users and great deals. Trade confidently and hassle-free.
            </p>
          </div>

          <div className='mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center'>
            {/* Left Features */}
            <div className='space-y-16'>
              <motion.div 
                className='text-center'
                initial={{ opacity: 0, x: -30 }}
                animate={whyChooseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className='flex justify-center mb-3'>
                  <div className='bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                    <span className='text-amber-500 text-2xl'>⚡</span>
                  </div>
                </div>
                <h3 className='text-xl font-bold mb-2'>EASY & FAST</h3>
                <p className='text-sm text-gray-600'>
                  Enjoy a smooth and hassle-free experience with our intuitive
                  platform. Post your ads in seconds and connect with
                  buyers or sellers instantly. No complications, just quick and
                  easy transactions.
                </p>
              </motion.div>

              <motion.div 
                className='text-center'
                initial={{ opacity: 0, x: -30 }}
                animate={whyChooseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className='flex justify-center mb-3'>
                  <div className='bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                    <span className='text-blue-500 text-2xl'>🌎</span>
                  </div>
                </div>
                <h3 className='text-xl font-bold mb-2'>WIDE VARIETY</h3>
                <p className='text-sm text-gray-600'>
                  Explore countless categories, from electronics and fashion to
                  home essentials and automobiles.
                </p>
              </motion.div>
            </div>

            {/* Center Image */}
            <motion.div 
              className='flex justify-center'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={whyChooseInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='relative w-full max-w-sm md:max-w-md overflow-hidden'>
                <div className='relative overflow-hidden rounded-full aspect-square'>
                  <Image 
                    src={aboutCarInterior} // Replace with car on road image
                    alt="Car on Road"
                    className="w-full h-full object-cover"
                    removeWrapper
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Features */}
            <div className='space-y-16'>
              <motion.div 
                className='text-center'
                initial={{ opacity: 0, x: 30 }}
                animate={whyChooseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className='flex justify-center mb-3'>
                  <div className='bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                    <span className='text-green-500 text-2xl'>✅</span>
                  </div>
                </div>
                <h3 className='text-xl font-bold mb-2'>SECURE TRANSACTIONS</h3>
                <p className='text-sm text-gray-600'>
                  Your safety is our priority. We ensure a reliable and
                  trustworthy environment for all users.
                </p>
              </motion.div>

              <motion.div 
                className='text-center'
                initial={{ opacity: 0, x: 30 }}
                animate={whyChooseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className='flex justify-center mb-3'>
                  <div className='bg-rose-100 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                    <span className='text-rose-500 text-2xl'>👥</span>
                  </div>
                </div>
                <h3 className='text-xl font-bold mb-2'>USER-FRIENDLY</h3>
                <p className='text-sm text-gray-600'>
                  A simple, smooth, and easy-to-navigate interface designed for
                  everyone.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default About