import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout } from '../../components'
import { useCartContext } from '../../hooks/useCartContext'
import db from '../../utils/db'
import Product from '../../models/Product'
import { toast } from 'react-toastify'

export default function ProductScreen({ product }) {
  const { cart, dispatch } = useCartContext()
  const router = useRouter()

  if (!product) {
    return (
      <Layout title='Product not found'>
        <h2 className='text-lg'>Product not found</h2>
      </Layout>
    )
  }

  const addToCartHandler = async () => {
    //  check if item is already in cart, if so increment qty else add it to cart
    const existItem = cart.cartItems.find(i => i.slug === product.slug)
    const qty = existItem ? ++existItem.qty : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    //  ensure product is currently in stock with axios call & throw alert if item's cart qty exceeds item's quantity in stock
    if (data.qtyInStock < qty) {
      return toast.error('Sorry, item is currently out of stock')
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, qty } })
    router.push('/cart')
  }

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href='/'>Back to products</Link>
      </div>
      <section className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.image}
            width={640}
            height={640}
            layout='responsive'
            objectFit='cover'
            priority
          />
        </div>

        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews}
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>

        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <p>Price</p>
              <p>${product.price}</p>
            </div>
            <div className='mb-2 flex justify-between'>
              <p>Status</p>
              <p>
                {product.qtyInStock > 0
                  ? `${product.qtyInStock} in stock`
                  : 'Unavailable'}
              </p>
            </div>
            <button className='btn-primary w-full' onClick={addToCartHandler}>
              Add to cart
            </button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { slug } = params

  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  }
}
