import { useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { Layout } from '../components'
import { getError } from '../utils/error'
import { toast } from 'react-toastify'

const Register = () => {
  const router = useRouter()
  const { redirect } = router.query

  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      })

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <Layout title='Create Account'>
      <form
        className='max-w-screen-md mx-auto'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Create Account</h1>
        <div className='mb-4'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            className='w-full'
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
          {errors.name && (
            <div className='text-red-500'>{errors.name.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            className='w-full'
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
          />
          {errors.email && (
            <div className='text-red-500'>{errors.email.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            className='w-full'
            autoFocus
            {...register('password', {
              required: 'Please enter password',
              minLength: {
                value: 6,
                message: 'Password must be longer than 5 characters',
              },
            })}
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            className='w-full'
            autoFocus
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: value => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'Password must be longer than 5 characters',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className='text-red-500'>{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className='text-red-500'>Passwords must match</div>
            )}
        </div>
        <div className='mb-4'>
          <button className='btn-primary'>Register</button>
        </div>
        <div className='mb-4'>
          Don&apos;t have an account? &nbsp;{' '}
          <Link href={`/register?redirect=${redirect || '/'}`}>
            <a className='text-teal-600'>Register</a>
          </Link>
        </div>
      </form>
    </Layout>
  )
}

export default Register
