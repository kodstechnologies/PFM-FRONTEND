import React from 'react'
import Header from './files/Header'
import Footer from './files/Footer'
import Banner from './files/Banner'
import FreshnessSection from './files/FreshnessSection'

function LayoutPage() {
    return (
        <div className='bg-red-600'><Header />
            <Banner />
            <FreshnessSection />
            <Footer />
        </div>
    )
}

export default LayoutPage