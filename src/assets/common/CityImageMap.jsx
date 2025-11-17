import gangneungImg from './city/gangneung.jpg'
import gyeongjuImg from './city/gyeongju.jpg'
import daeguImg from './city/daegu.jpg'
import busanImg from './city/busan.jpg'
import seoulImg from './city/seoul.jpg'
import incheonImg from './city/incheon.jpg'
import jeonjuImg from './city/jeonju.jpg'
import jejuImg from './city/jeju.jpg'
import pohangImg from './city/pohang.jpg'
import defaultImg from './city/default.jpg'

/**도시명-이미지 매핑 */
export const CITY_IMAGE_MAP = {
  강릉시: gangneungImg,
  경주시: gyeongjuImg,
  대구광역시: daeguImg,
  부산광역시: busanImg,
  서울특별시: seoulImg,
  인천광역시: incheonImg,
  전주시: jeonjuImg,
  제주시: jejuImg,
  포항시: pohangImg,
}

const CITY_KEYS = Object.keys(CITY_IMAGE_MAP)

const getCityImage = (city) => {
  if (!city) return defaultImg
  if (Array.isArray(city) && city.length === 0) return defaultImg

  const list = Array.isArray(city) ? city : [city]
  const names = list.map((c) => String(c).trim())

  for (const name of names) {
    if (CITY_IMAGE_MAP[name]) return CITY_IMAGE_MAP[name]
  }

  for (const name of names) {
    const match = CITY_KEYS.find((key) => name.includes(key))
    if (match) return CITY_IMAGE_MAP[match]
  }

  return defaultImg
}

export default getCityImage
export { defaultImg }
