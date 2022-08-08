import React from 'react'
import _backButton from '../static/images/back.svg'
import Footer from './Footer'
import EventNavbar from './EventNavbar'
import Header from './Header'
// import Header from "./Header";

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    // <!-- Page wrapper start -->
    <div className='page-wrapper'>
      {/* <!-- Content wrapper start --> */}
      <div className='content-wrapper ws-860 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column'>
        {/* <!-- Main content start --> */}
        <div>
          <EventNavbar />
          <Header />
          {children}
        </div>
        {/* <!-- Main content end --> */}

        <Footer />
      </div>
      {/* <!-- Content wrapper end --> */}
    </div>
  )
}
