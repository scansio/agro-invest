import Reblend, { SharedConfig, useEffect, useState } from 'reblendjs'
import { Card } from 'react-bootstrap'
import { WS_BASE } from '../../../../utils/RestEndpoints'

const ConnectedClients = ({ style, className }) => {
  const [connected, setConnected] = useState('')

  useEffect(() => {
    const socket = new WebSocket(WS_BASE)

    socket.onmessage = (event) => {
      const res = JSON.parse(event.data)
      setConnected(res?.connected || 0)
    }

    socket.onopen = () => {
      socket.send(SharedConfig.getSessionData('auth'))
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <Card className={`${className ? className : ''} `} style={{ ...style }} title="Users on trade/dashboard page">
      <Card.Body className="text-center h1">{connected}</Card.Body>
      <div className="text-center text-primary">Active users</div>
    </Card>
  )
}

export default ConnectedClients
