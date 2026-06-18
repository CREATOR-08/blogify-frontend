
import Footer from '../components/homePage/Footer'

import Navbar from '../components/Navbar'
import SlidingCards from '../components/homePage/SlidingCards'
import Advantages from '../components/homePage/Advantages'
import BlogifyHero from '../components/homePage/BlogifyHero'

const Home = () => {
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
