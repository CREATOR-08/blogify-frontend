
import Footer from '../components/Footer'
import MainHome from '../components/MainHome'
import Navbar from '../components/Navbar'
import SlidingCards from '../components/SlidingCards'
import Advantages from '../components/Advantages'

const Home = () => {
  return (
    <div className='w-screen '>
      <Navbar />
      <MainHome />
      <Advantages />
      <SlidingCards />
      <Footer />
    </div>
  )
}

export default Home
