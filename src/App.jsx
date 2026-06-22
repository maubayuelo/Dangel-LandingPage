import { useQuery } from '@apollo/client'
import { GET_PAGE } from './graphql/queries'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Services from './components/Services'
import Process from './components/Process'
import About from './components/About'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import CtaFinal from './components/CtaFinal'
import Footer from './components/Footer'

export default function App() {
  const { data, loading, error } = useQuery(GET_PAGE)

  if (loading) return <div style={{ minHeight: '100vh', background: '#F7F4EE' }} />
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>GraphQL error: {error.message}</p>

  const p = data?.page

  return (
    <>
      <Nav data={p?.fgNavigation} />
      <main>
        <Hero data={p?.fgHero} />
        <Benefits data={p?.fgBenefits} />
        <Services data={p?.fgServices} />
        <Process data={p?.fgProcess} />
        <About data={p?.fgAbout} />
        <Testimonials data={p?.fgTestimonials} />
        <FAQ data={p?.fgFaq} />
        <Contact data={p?.fgContact} />
        <CtaFinal data={p?.fgCtaFinal} />
      </main>
      <Footer data={p?.fgFooter} global={p?.fgGlobal} />
    </>
  )
}
