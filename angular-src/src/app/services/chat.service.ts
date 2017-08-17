import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
  private url = 'http://localhost:4000';
  private socket;

  sendMessage(message) {
    this.socket.emit('mqtt message', message);
    console.log("MESSAGE SENT");
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('blackout message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }
}
