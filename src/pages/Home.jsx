const Home = () => {
  return (
    <nav className='flex h-screen w-screen items-center justify-center gap-2'>
      <button>
        <a href='/signup'>회원가입</a>
      </button>
      <button>
        <a href='/signin'>로그인</a>
      </button>
    </nav>
  )
}

export default Home
