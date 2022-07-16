import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CheckoutWizard, Layout } from '../components'
import { useCartContext } from '../hooks/useCartContext'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

const Payment = () => {
  const router = useRouter()
  const { cart, dispatch } = useCartContext()
  const { shippingAddress, paymentMethod } = cart

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const submitHandler = e => {
    e.preventDefault()
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required')
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod })

    Cookies.set(
      'cart',
      JSON.stringify({ ...cart, paymentMethod: selectedPaymentMethod })
    )

    router.push('/placeorder')
  }

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping')
    }
    setSelectedPaymentMethod(paymentMethod || '')
  }, [shippingAddress.address, router, paymentMethod])

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2} />
      <form className='max-w-screen-md mx-auto' onSubmit={submitHandler}>
        <h1 className='mb-4 text-xl'>Payment Method</h1>
        {['PayPal', 'Stripe', 'CashOnDelivery'].map(payment => (
          <div key={payment} className='mb-4'>
            <input
              type='radio'
              checked={selectedPaymentMethod === payment}
              name={paymentMethod}
              id={payment}
              className='p-2 outline-none focus:ring-0'
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment} className='p-2'>
              {payment}
            </label>
          </div>
        ))}
        <div className='mb-4 flex justify-between'>
          <button
            className='btn-default'
            type='button'
            onClick={() => router.push('/shipping')}
          >
            Back
          </button>
          <button className='btn-primary'>Next</button>
        </div>
      </form>
    </Layout>
  )
}

Payment.auth = true

export default Payment
