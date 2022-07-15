import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Layout } from '../components'
import { useCartContext } from '../hooks/useCartContext'
import { XCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'

const Cart = () => {
  const { cart, dispatch } = useCartContext()
  const { cartItems } = cart
  const router = useRouter()

  const updateCartHandler = async (item, val) => {
    const qty = Number(val)
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.qtyInStock < qty) {
      return toast.error('Sorry, item is currently out of stock')
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, qty } })
    toast.success('Item quantity updated')
  }

  const removeItemHandler = item => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  return (
    <Layout title='Cart'>
      <h1 className='mb-4 text-2xl text-center font-bold'>My Cart</h1>

      {cartItems.length > 0 ? (
        <section className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>Item</th>
                  <th className='p-5 text-center'>Quantity</th>
                  <th className='p-5 text-center'>Price</th>
                  <th className='p-5'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map(item => (
                  <tr key={item.slug} className='border-b text-center'>
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className='flex items-center'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            objectFit='cover'
                          />{' '}
                          &nbsp; {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className='p-5'>
                      <select
                        value={item.qty}
                        onChange={e => updateCartHandler(item, e.target.value)}
                      >
                        {[...Array(item.qtyInStock).keys()].map(q => (
                          <option key={q + 1} value={q + 1}>
                            {q + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='p-5'>${item.price}</td>
                    <td className='p-5'>
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className='w-6 h-6'></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='card p-5'>
            <ul>
              <li>
                <p className='pb-3 text-lg'>
                  Subtotal ({cartItems.reduce((acc, cur) => acc + cur.qty, 0)}){' '}
                  : $
                  {cartItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0)}
                </p>
              </li>
              <li>
                <button
                  className='btn-primary w-full'
                  onClick={() => router.push('login?redirect=/shipping')}
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </section>
      ) : (
        <>
          <h2 className='mb-3 text-xl'>Cart is currently empty!</h2>
          <Link href='/'>Continue shopping</Link>
        </>
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false })
