const LoginForm = () => {
  return (
    <fieldset className='border p-5'>
      <legend className='p-2'>로그인</legend>
      <form className='flex w-100 flex-col gap-2'>
        <input
          type='text'
          placeholder='ID'
          className='rounded-2xl border p-2'
        />
        <input
          type='password'
          placeholder='password'
          className='rounded-2xl border p-2'
        />
        <button type='submit'>로그인</button>
      </form>
      <button className='mt-2'>
        <a href='/signup'>회원가입</a>
      </button>
    </fieldset>
  )
}

export default LoginForm
