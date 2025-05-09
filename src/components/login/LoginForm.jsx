const LoginForm = () => {
  return (
    <form className='flex flex-col w-100 gap-2'>
      <input type='text' placeholder='ID' className='border rounded-2xl p-2' />
      <input
        type='password'
        placeholder='password'
        className='border rounded-2xl p-2'
      />
      <button type='submit' className='border rounded-2xl'>
        로그인
      </button>
    </form>
  )
}

export default LoginForm
