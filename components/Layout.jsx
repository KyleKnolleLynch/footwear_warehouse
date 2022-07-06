import Head from 'next/head'
import { Header, Footer } from './index'

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

      <div className='min-h-screen flex flex-col justify-between'>
        <Header />

        <main className='container m-auto mt-4 px-4'>{children}</main>

        <Footer />
      </div>
    </>
  )
}
