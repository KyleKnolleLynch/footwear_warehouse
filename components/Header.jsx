import Link from 'next/link'

export const Header = () => {
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
            <a className='px-2'>Cart</a>
          </Link>
          <Link href='/login'>
            <a className='px-2'>Login</a>
          </Link>
        </div>
      </nav>
    </header>
  )
}
