import Link from 'next/link'

export const ProductItem = ({ product, addToCartHandler }) => {
  return (
    <article className='card'>
      <Link href={`/product/${product.slug}`}>
        <a>
          <img
            src={product.image}
            alt={product.name}
            className='rounded-t shadow w-full h-1/2 object-cover'
          />
        </a>
      </Link>

      <div className='flex flex-col items-center justify-center p-5'>
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className='text-lg text-teal-600'>{product.name}</h2>
          </a>
        </Link>
        <p className='mb-2'>{product.brand}</p>
        <p className='mb-2'>${product.price}</p>
        <button type='button' className='btn-primary' onClick={() => addToCartHandler(product)}>
          Add to cart
        </button>
      </div>
    </article>
  )
}
