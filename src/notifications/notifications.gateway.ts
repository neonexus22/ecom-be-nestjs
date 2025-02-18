import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enable cors for websocket connections
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_notification')
  handleNotification(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received notification: ${client.id} ${data}`);
    this.server.emit(
      'receive_notification',
      `You: ${data}. Me: "Hi, how are you?"`,
    );
  }
}
