import { useReducer, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { Layout } from '../../components'
import { getError } from '../../utils/error'
import { toast } from 'react-toastify'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true }
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true }
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload }
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' }
    default:
      state
  }
}

function OrderScreen() {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const { query } = useRouter()
  const orderId = query.id

  const [
    { loading, error, order, successPay, loadingPay },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/${orderId}`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder()
      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal')
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPayPalScript()
    }
  }, [order, orderId, paypalDispatch, successPay])

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then(orderId => {
        return orderId
      })
  }

  async function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        )
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        toast.success('Order is paid successfully')
      } catch (error) {
        dispatch({ type: 'PAY_FAIL', payload: getError(error) })
        toast.error(getError(error))
      }
    })
  }

  function onError(err) {
    toast.error(getError(err))
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className='mb-4 text-xl'>{`Order ${orderId}`}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='alert-error'>{error}</p>
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
              {isDelivered ? (
                <p className='alert-success'>Delivered at {deliveredAt}</p>
              ) : (
                <p className='alert-error'>Not delivered</p>
              )}
            </article>

            <article className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <p className='alert-success'>Paid at {paidAt}</p>
              ) : (
                <p className='alert-error'>Not paid</p>
              )}
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
                  {orderItems.map(item => (
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
            </article>
          </div>

          <div>
            <article className='card p-5'>
              <h2 className='mb-2 text-lg'>Order Summary</h2>
              <ul>
                <li className='mb-2 flex justify-between'>
                  <p>Items</p>
                  <p>${itemsPrice}</p>
                </li>
                <li className='mb-2 flex justify-between'>
                  <p>Tax</p>
                  <p>${taxPrice}</p>
                </li>
                <li className='mb-2 flex justify-between'>
                  <p>Shipping</p>
                  <p>${shippingPrice}</p>
                </li>
                <li className='mb-2 flex justify-between'>
                  <p>Total</p>
                  <p>${totalPrice}</p>
                </li>
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <p>Loading...</p>
                    ) : (
                      <div className='w-full'>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </article>
          </div>
        </section>
      )}
    </Layout>
  )
}

OrderScreen.auth = true
export default OrderScreen
