import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Layout } from '../components'

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const submitHandler = ({ email, password }) => {
    
  }

  return (
    <Layout title='Login'>
      <form
        className='max-w-screen-md mx-auto'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Login</h1>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            className='w-full'
            autoFocus
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
          <button className='btn-primary'>Login</button>
        </div>
        <div className='mb-4'>
          Don't have an account? &nbsp; <Link href='register'>Register</Link>
        </div>
      </form>
    </Layout>
  )
}

export default Login
