import { data } from '../utils/data'
import { Layout, ProductItem } from '../components'

const Home = () => {
  return (
    <Layout title='Home Page'>
      <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {data.products.map(product => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </section>
    </Layout>
  )
}

export default Home
