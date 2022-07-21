import axios from 'axios'
import { useEffect, useReducer } from 'react'
import Link from 'next/link'
import { getError } from '../utils/error'
import { Layout } from '../components'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, errors: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

function OrderHistory() {
  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/history`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchOrders()
  }, [])

  console.log(orders)

  return (
    <Layout title='Order History'>
      <h1 className='mb-4 text-xl'>Order History</h1>
      {loading ? (
        <section>Loading...</section>
      ) : error ? (
        <section className='alert-error'>{error}</section>
      ) : (
        <section className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='border-b'>
              <tr>
                <th className='px-5 text-left'>ID</th>
                <th className='p-5 text-left'>DATE</th>
                <th className='p-5 text-left'>TOTAL</th>
                <th className='p-5 text-left'>PAID</th>
                <th className='p-5 text-left'>DELIVERED</th>
                <th className='p-5 text-left'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map(order => (
                <tr key={order._id} className='border-b'>
                  <td className='p-5'>{order._id.substring(20, 24)}</td>
                  <td className='p-5'>{order.createdAt.substring(0, 10)}</td>
                  <td className='p-5'>{order.totalPrice}</td>
                  <td className='p-5'>
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : 'not paid'}
                  </td>
                  <td className='p-5'>
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className='p-5'>
                    <Link href={`/order/${order._id}`} passHref>
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </Layout>
  )
}

OrderHistory.auth = true
export default OrderHistory
