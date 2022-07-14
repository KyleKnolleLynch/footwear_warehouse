export const CheckoutWizard = ({ activeStep = 0}) => {
  return (
    <section className='mb-5 flex flex-wrap'>
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step, idx) => (
          <p
            key={step}
            className={`flex-1 border-b-2 text-center font-bold ${
              idx <= activeStep
                ? 'border-indigo-500 text-indigo-500'
                : 'border-gray-400 text-gray-400'
            }`}
          >
            {step}
          </p>
        )
      )}
    </section>
  )
}
