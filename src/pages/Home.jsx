
import { useEffect } from 'react'
import Footer from '../components/homePage/Footer'

import Navbar from '../components/Navbar'
import SlidingCards from '../components/homePage/SlidingCards'
import Advantages from '../components/homePage/Advantages'
import BlogifyHero from '../components/homePage/BlogifyHero'
import api from '../utils/api'

const Home = () => {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        await api.get('/')
        // successful health check; no UI action required
      } catch (err) {
        console.error('Backend health check failed:', err)
      }
    }
    pingBackend()
  }, [])

  return (
    <div className='w-screen '>
      <Navbar />
      <BlogifyHero/>
      <Advantages />
      <SlidingCards />
      <Footer />
    </div>
  )
}

export default Home
