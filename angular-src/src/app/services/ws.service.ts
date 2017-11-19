import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';

const WS_URL = location.origin.replace(/^http/, 'ws');
// const WS_URL = "http://localhost:4200";

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
				const data = JSON.parse(response.data);
				return {
					type: data.type,
					message: data.message
				};
			});
	}
}
