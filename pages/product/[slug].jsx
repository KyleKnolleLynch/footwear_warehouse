import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout } from '../../components'
import { data } from '../../utils/data'
import { useCartContext } from '../../hooks/useCartContext'

export default function ProductScreen() {
  const { cart, dispatch } = useCartContext()
  const router = useRouter()
  const { query } = useRouter()
  const { slug } = query
  const product = data.products.find(p => p.slug === slug)

  if (!product) {
    return <div>Product not found</div>
  }

  const addToCartHandler = () => {
    //  check if item is already in cart, if so increment qty else add it to cart
    const existItem = cart.cartItems.find(i => i.slug === product.slug)
    const qty = existItem ? ++existItem.qty : 1

    //  throw alert if item's cart qty exceeds item's quantity in stock
    if (product.qtyInStock < qty) {
      alert('Sorry, this product is currently out of stock.')
      return
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
