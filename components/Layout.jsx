import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { Header, Footer } from './index'
import 'react-toastify/dist/ReactToastify.css'

export const Layout = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>
          {title ? `${title} - Footwear Warehouse` : 'Footwear Warehouse'}
        </title>
        <meta name='description' content='Ecommerce Website' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='min-h-screen flex flex-col justify-between'>
        <Header />

        <main className='container m-auto mt-4 px-4'>{children}</main>

        <Footer />
      </div>
    </>
  )
}
