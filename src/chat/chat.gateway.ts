import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { MessageData } from './chat.interface'
import { Cron, CronExpression } from '@nestjs/schedule'
import { UseGuards } from '@nestjs/common'
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard'

@WebSocketGateway({
  path: '/chat/socket.io',
  cors: {
    origin: 'http://localhost:8080',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('clientToServer')
  async clientToServer(
    @MessageBody() clientData: MessageData
  ): Promise<MessageData> {
    return {
      content: 'hahlo',
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @Cron(CronExpression.EVERY_10_MINUTES)
  async sayHi() {
    this.server.emit('serverToClient', { content: 'enne' })
  }
}
