import { useEffect } from 'react'
import { Layout, CheckoutWizard } from '../components'
import { useCartContext } from '../hooks/useCartContext'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const Shipping = () => {
  const router = useRouter()
  const { cart, dispatch } = useCartContext()
  const { shippingAddress } = cart
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm()

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_INFO',
      payload: { fullName, address, city, postalCode, country },
    })
    //  store shipping info in cookies
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    )

    router.push('/payment')
  }

  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard activeStep={1} />
      <form
        className='max-w-screen-md mx-auto'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Shipping Address</h1>
        <div className='mb-4'>
          <label htmlFor='fullName'>Full Name</label>
          <input
            type='text'
            id='fullName'
            className='w-full'
            autoFocus
            {...register('fullName', {
              required: 'Please enter full name',
            })}
          />
          {errors.fullName && (
            <p className='text-red-500'>{errors.fullName.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='address'>Address</label>
          <input
            type='text'
            id='address'
            className='w-full'
            autoFocus
            {...register('address', {
              required: 'Please enter address',
              minLength: {
                value: 3,
                message: 'Address is greater than 2 characters',
              },
            })}
          />
          {errors.address && (
            <p className='text-red-500'>{errors.address.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='city'>City</label>
          <input
            type='text'
            id='city'
            className='w-full'
            autoFocus
            {...register('city', {
              required: 'Please enter city',
            })}
          />
          {errors.city && (
            <p className='text-red-500'>{errors.city.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='postalCode'>Postal Code</label>
          <input
            type='text'
            id='postalCode'
            className='w-full'
            autoFocus
            {...register('postalCode', {
              required: 'Please enter postal code',
            })}
          />
          {errors.postalCode && (
            <p className='text-red-500'>{errors.postalCode.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='country'>Country</label>
          <input
            type='text'
            id='country'
            className='w-full'
            autoFocus
            {...register('country', {
              required: 'Please enter country',
            })}
          />
          {errors.country && (
            <p className='text-red-500'>{errors.country.message}</p>
          )}
        </div>
        <div className='mb-4 flex justify-between'>
          <button className='btn-primary'>Next</button>
        </div>
      </form>
    </Layout>
  )
}

Shipping.auth = true

export default Shipping
