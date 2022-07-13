import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartContext } from '../hooks/useCartContext'
import { DropdownLink } from './index'
import { Menu } from '@headlessui/react'

export const Header = () => {
  const { status, data: session } = useSession()
  const { cart, dispatch } = useCartContext()
  const [cartItemsQty, setCartItemsQty] = useState(0)

  useEffect(() => {
    setCartItemsQty(cart.cartItems.reduce((acc, cur) => acc + cur.qty, 0))
  }, [cart.cartItems])

  const logoutClickHandler = () => {
    dispatch({ type: 'CART_RESET' })
    signOut({ callbackUrl: '/login' })
  }

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
              {cartItemsQty > 0 && (
                <span className='ml-1 py-0.5 px-1.5 rounded-full bg-teal-500 font-bold text-white text-xs'>
                  {cartItemsQty}
                </span>
              )}
            </a>
          </Link>

          {status === 'loading' ? (
            <p>'Loading'</p>
          ) : session?.user ? (
            <Menu as='div' className='relative inline-block'>
              <Menu.Button className='text-teal-500 hover:text-teal-600'>
                {session.user.name}
              </Menu.Button>
              <Menu.Items className='absolute right-0 w-56 origin-top-right shadow-lg bg-white'>
                <Menu.Item>
                  <DropdownLink className='dropdown-link' href='/profile'>
                    Profile
                  </DropdownLink>
                </Menu.Item>
                <Menu.Item>
                  <DropdownLink className='dropdown-link' href='/order-history'>
                    Order History
                  </DropdownLink>
                </Menu.Item>
                <Menu.Item>
                  <a
                    href='#'
                    className='dropdown-link'
                    onClick={logoutClickHandler}
                  >
                    Logout
                  </a>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <Link href='/login'>
              <a className='px-2'>Login</a>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

//  TODO 2:49:00 timestamp ~ creating dropdown links
