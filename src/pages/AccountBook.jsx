import React from 'react'
import { useParams } from 'react-router-dom'

const AccountBook = () => {
  const { tripId } = useParams()
  return <div>Trip {tripId} 가계부</div>
}

export default AccountBook
