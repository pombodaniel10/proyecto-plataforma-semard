import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';

const WS_URL = 'ws://localhost:8080';

export interface Message {
	type: string,
	message: any
}

@Injectable()
export class WsService {
	public messages: Subject<Message>;

	constructor(wsService: WebsocketService) {
		this.messages = <Subject<Message>>wsService
			.connect(WS_URL)
			.map((response: MessageEvent): Message => {
				let data = JSON.parse(response.data);
				return {
					type: data.type,
					message: data.message
				}
			});
	}
}
