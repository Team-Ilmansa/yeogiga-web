import PlaceMapWithPin from '@/components/trip/pin/PlaceMapWithPin'
import { useEffect } from 'react'

/**목적지 검색을 위한 지도 화면 */
const PlaceMap = () => {
  useEffect(() => {
    /**지도 생성 함수 */
    const initMap = (lat, lng) => {
      /**지도 옵션 설정 */
      const mapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 13,
        minZoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: naver.maps.MapTypeControlStyle.BUTTON,
          position: naver.maps.Position.TOP_RIGHT,
        },
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      }

      /**지도 객체 생성 */
      const map = new naver.maps.Map('map', mapOptions)

      /**마커 생성 */
      const location = new naver.maps.LatLng(lat, lng)
      new naver.maps.Marker({
        position: location,
        map,
      })
    }

    // 현위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          initMap(latitude, longitude)
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error)
          initMap(37.5665, 126.978) // 실패 시 서울 시청 좌표
        },
      )
    } else {
      initMap(37.5665, 126.978)
    }
  }, [])

  return (
    <div className='relative h-full w-full'>
      <div id='map' className='h-full w-full'></div>
      <PlaceMapWithPin />
    </div>
  )
}

export default PlaceMap
