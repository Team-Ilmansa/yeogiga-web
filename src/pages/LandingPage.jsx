import React, { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

/**앱 초대 화면으로 이동을 위한 랜딩페이지 */
const LandingPage = () => {
  const [searchParams] = useSearchParams()

  const { tripId } = useParams()
  const title = searchParams.get('title')

  // 앱 딥링크로 이동
  useEffect(() => {
    const deepLink = `yeogiga://trip/invite/${tripId}?title=${title}`

    window.location.href = deepLink
  })
}

export default LandingPage
