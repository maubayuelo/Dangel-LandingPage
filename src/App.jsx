import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PAGE } from './graphql/queries'
import { useLanguage } from './hooks/useLanguage'
import { useAnalytics } from './hooks/useAnalytics'
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
import BookingModal from './components/BookingModal'

export default function App() {
  const { lang, changeLang } = useLanguage()
  const [modalOpen, setModalOpen] = useState(false)

  // Each WPML translation is a separate WP page — URIs confirmed via GraphQL introspection
  const LANG_PAGE_URIS = { en: '/home/', fr: '/fr/accueil/', es: '/es/inicio/' }
  const { data, loading, error } = useQuery(GET_PAGE, {
    variables: { pageId: LANG_PAGE_URIS[lang] || '/home/' },
  })

  const p = data?.page
  const g = p?.fgGlobal

  // Analytics hooks — inert while IDs are empty; activate at launch
  useAnalytics({
    metaPixelId: g?.globalMetaPixelId || '',
    ga4Id: g?.globalGa4Id || '',
  })

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  if (loading) return <div style={{ minHeight: '100vh', background: '#F7F4EE' }} />
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>GraphQL error: {error.message}</p>

  return (
    <>
      <Nav
        data={p?.fgNavigation}
        lang={lang}
        onLangChange={changeLang}
        onBook={openModal}
      />
      <main>
        <Hero data={p?.fgHero} onBook={openModal} />
        <Benefits data={p?.fgBenefits} />
        <Services data={p?.fgServices} onBook={openModal} />
        <Process data={p?.fgProcess} />
        <About data={p?.fgAbout} onBook={openModal} />
        <Testimonials data={p?.fgTestimonials} lang={lang} />
        <FAQ data={p?.fgFaq} />
        <Contact data={p?.fgContact} />
        <CtaFinal data={p?.fgCtaFinal} onBook={openModal} />
      </main>
      <Footer data={p?.fgFooter} global={g} />

      <BookingModal
        open={modalOpen}
        onClose={closeModal}
        bookingUrl={g?.globalBookingUrl}
        lang={lang}
      />
    </>
  )
}
