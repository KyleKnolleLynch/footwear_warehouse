import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useCartContext } from '../hooks/useCartContext'
import { CheckoutWizard, Layout } from '../components'
import { getError } from '../utils/error'

const PlaceOrder = () => {
  const router = useRouter()
  const { cart, dispatch } = useCartContext()
  const { cartItems, shippingAddress, paymentMethod } = cart
  const [loading, setLoading] = useState(false)

  //  Func to round price to nearest two numbers after decimal point
  const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100

  //  Calculate items total price before shipping and taxes
  const itemsPrice = round2(
    cartItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0)
  )

  //  Calculate shipping price
  const shippingPrice = itemsPrice > 200 ? 0 : 15

  //  Calculate tax price
  const taxPrice = round2(itemsPrice * 0.08)

  //  Calculate total price
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice)

  const placeOrderHandler = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
      setLoading(false)
      dispatch({ type: 'CART_CLEAR_ITEMS' })
      Cookies.set('cart', JSON.stringify({ ...cart, cartItems: [] }))

      router.push(`/order/${data._id}`)
    } catch (err) {
      setLoading(false)
      toast.error(getError(err))
    }
  }
  //  TODO timestamp: 3:48:00 need to create order details page and api

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
    }
  }, [])

  return (
    <Layout title='Place Order'>
      <CheckoutWizard activeStep={3} />
      <h1 className='mb-4 text-xl'>Place Order</h1>
      {cartItems.length === 0 ? (
        <section>
          Cart is empty. <Link href='/'>Keep shopping</Link>
        </section>
      ) : (
        <section className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <article className='card p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <p>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
              <Link href='/shipping'>Edit</Link>
            </article>
            <article className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <p>{paymentMethod}</p>
              <Link href='/payment'>Edit</Link>
            </article>
            <article className='card p-5 overflow-x-auto'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='p-5 text-right'>Quantity</th>
                    <th className='p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item._id} className='border-b'>
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className='flex items-center'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.qty}</td>
                      <td className='p-5 text-right'>${item.price}</td>
                      <td className='p-5 text-right'>
                        ${item.qty * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href='/cart'>Edit</Link>
            </article>
          </div>

          <div>
            <article className='card p-5'>
              <h2 className='mb-2 text-lg'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <p>Items</p>
                    <p>${itemsPrice}</p>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <p>Tax</p>
                    <p>${taxPrice}</p>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <p>Shipping</p>
                    <p>${shippingPrice}</p>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <p>Total</p>
                    <p>${totalPrice}</p>
                  </div>
                </li>
                <li>
                  <button
                    className='btn-primary w-full font-bold'
                    onClick={placeOrderHandler}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Place Order'}
                  </button>
                </li>
              </ul>
            </article>
          </div>
        </section>
      )}
    </Layout>
  )
}

PlaceOrder.auth = true

export default PlaceOrder
