import axios from 'axios'
import db from '../utils/db'
import Product from '../models/Product'
import { Layout, ProductItem } from '../components'
import { useCartContext } from '../hooks/useCartContext'
import { toast } from 'react-toastify'

const Home = ({ products }) => {
  const { cart, dispatch } = useCartContext()

  const addToCartHandler = async product => {
    //  check if item is already in cart, if so increment qty else add it to cart
    const existItem = cart.cartItems.find(i => i.slug === product.slug)
    const qty = existItem ? ++existItem.qty : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    //  ensure product is currently in stock with axios call & throw alert if item's cart qty exceeds item's quantity in stock
    if (data.qtyInStock < qty) {
      toast.error('Sorry, item is out of stock')
      return
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, qty } })
    toast.success('Item added to your cart')
  }

  return (
    <Layout title='Home Page'>
      <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {products.map(product => (
          <ProductItem key={product.slug} product={product} addToCartHandler={addToCartHandler} />
        ))}
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find().lean()
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  }
}

export default Home
