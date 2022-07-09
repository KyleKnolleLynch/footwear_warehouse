import Link from 'next/link'
import { useCartContext } from '../hooks/useCartContext'

export const Header = () => {
  const { cart } = useCartContext()
  return (
    <header>
      <nav
        className='h-12 flex items-center justify-between px-4 shadow-sm'
        aria-label='Primary'
      >
        <Link href='/'>
          <a className='text-lg font-bold'>Footwear Warehouse</a>
        </Link>
        <div>
          <Link href='/cart'>
            <a className='px-2'>
              Cart
              {cart.cartItems.length > 0 && (
                <span className='ml-1 py-0.5 px-1.5 rounded-full bg-teal-500 font-bold text-white text-xs'>
                  {cart.cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                </span>
              )}
            </a>
          </Link>
          <Link href='/login'>
            <a className='px-2'>Login</a>
          </Link>
        </div>
      </nav>
    </header>
  )
}
