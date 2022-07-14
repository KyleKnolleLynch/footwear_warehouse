import { useRouter } from 'next/router'
import { Layout } from '../components'

const Unauthorized = () => {
    const router = useRouter()
    const { message } = router.query

  return (
    <Layout title='Unauthorized Page'>
      <h1 className='text-xl'>Access Denied</h1>
      {message && <section className='mb-4 text-red-500'>{message}</section>}
    </Layout>
  )
}

export default Unauthorized
