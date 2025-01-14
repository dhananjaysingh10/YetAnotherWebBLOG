import React from 'react'
import { Link } from 'react-router-dom'
import { Footer } from 'flowbite-react'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble, BsTelegram } from 'react-icons/bs';
export default function FooterComponent() {
  return (
    <Footer container className='border border-t-1 border-gray-400'>

      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>

          <div className='mt-5'>
            {/* <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-l from-[#fb7185] via-[#a21caf] to-[#6366f1] rounded-lg text-white">CP </span>
              Blog
            </Link> */}
            <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white">
              <div className='text-black flex dark:text-white'>
              <div className='my-1 mx-1'>
              Yet Another
              </div>
              <div className='my-1'>
              <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-400 rounded-lg text-black">WebBLOG </span>
              </div>
              
              </div>
          </Link>
          </div>
          

          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Team
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Code of Conduct
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Contribute' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                {/* <Footer.Link href='#'>Discord</Footer.Link> */}
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>


        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="CP blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='#' icon={BsInstagram} />
            <Footer.Icon href='#' icon={BsTwitter} />
            <Footer.Icon href='#' icon={BsGithub} />
            <Footer.Icon href='#' icon={BsTelegram} />

          </div>
        </div>
      </div>

    </Footer>
  )
}
