let settings = chrome.storage.local;

// メニュークリックのイベント
chrome.contextMenus.onClicked.addListener(onClickRead);

function onClickRead(info) {
	switch (info.menuItemId) {
		case "read":
			bouyomi_talk(info.selectionText);
			break;
	}
}

// メニューの登録
chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		title: "読み上げる",
		contexts: ['selection'],
		id: "read"
	});
})

/**
 * WebSocket接続を作成する
 * @param {number} port - 接続先ポート番号
 * @returns {Promise<WebSocket>} - WebSocketオブジェクト
 */
async function createWebSocket(port) {
	return new Promise((resolve, reject) => {
		const socket = new WebSocket(`ws://localhost:${port}/`);
		
		socket.onopen = () => {
			resolve(socket);
		};
		
		socket.onerror = (error) => {
			reject(error);
		};
		
		// 5秒でタイムアウト
		setTimeout(() => {
			if (socket.readyState !== WebSocket.OPEN) {
				reject(new Error("WebSocket接続タイムアウト"));
			}
		}, 5000);
	});
}

/**
 * WebSocketを使用してJSONデータを送信する
 * @param {Object} data - 送信するJSONデータ
 * @param {number} [port] - 接続先ポート番号（指定がない場合は設定から取得）
 * @returns {Promise<void>}
 */
async function sendJsonToWebSocket(data, port) {
	try {
		// ポート番号が指定されていない場合は設定から取得
		if (!port) {
			const portResult = await settings.get("port_number");
			port = portResult.port_number || 55000;
		}
		
		// 新しいWebSocket接続を作成
		const socket = await createWebSocket(port);
		
		return new Promise((resolve, reject) => {
			// メッセージ送信完了時のハンドラを設定
			socket.onmessage = (event) => {
				console.log("サーバーからの応答:", event.data);
				socket.close();
				resolve(true);
			};
			
			// エラー発生時のハンドラ
			socket.onerror = (error) => {
				socket.close();
				reject(error);
			};
			
			// 接続が閉じられた時のハンドラ
			socket.onclose = () => {
				resolve(true);
			};
			
			// JSONデータを送信
			socket.send(JSON.stringify(data));
			
			// サーバーが応答を返さない場合のフォールバック
			// 一部のコマンドはサーバーが応答を返さない可能性があるため
			setTimeout(() => {
				if (socket.readyState === WebSocket.OPEN) {
					socket.close();
					resolve(true);
				}
			}, 3000);
		});
	} catch (error) {
		throw error;
	}
}

/**
 * 制御コマンドを送信する
 * @param {string} command - 送信するコマンド (stop/pause/resume/skip)
 */
async function sendCommand(command) {
	try {
		// コマンドデータを作成
		const data = { command: command };
		
		// WebSocketで送信
		await sendJsonToWebSocket(data);
	} catch (error) {
		console.error(`コマンド送信エラー (${command}):`, error);
	}
}

/**
 * 棒読みちゃんに喋らせる
 * @param {string} text - 読み上げるテキスト
 */
async function bouyomi_talk(text) {
	if (!text || text.trim() === "") {
		return;
	}

	try {
		// 設定値の取得
		const speedResult = await settings.get(["voice_speed", "voice_speed_def"]);
		const speed = speedResult.voice_speed_def ? -1 : parseInt(speedResult.voice_speed);

		const pitchResult = await settings.get(["voice_pitch", "voice_pitch_def"]);
		const pitch = pitchResult.voice_pitch_def ? -1 : parseInt(pitchResult.voice_pitch);

		const volumeResult = await settings.get(["voice_volume", "voice_volume_def"]);
		const volume = volumeResult.voice_volume_def ? -1 : parseInt(volumeResult.voice_volume);

		const typeResult = await settings.get(["voice_type", "voice_type_def"]);
		const vtype = typeResult.voice_type_def ? 0 : parseInt(typeResult.voice_type);

		const data = {
			command: "talk",
			speed: speed,
			pitch: pitch,
			volume: volume,
			voiceType: vtype,
			text: text
		};

		await sendJsonToWebSocket(data);
	} catch (error) {
		console.error("読み上げリクエスト送信エラー:", error);
	}
}

// メッセージリスナーを追加
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.action) {
		case "test_talk":
			bouyomi_talk(request.text);
			sendResponse({status: "success"});
			break;
		case "stop":
		case "pause":
		case "resume":
		case "skip":
			sendCommand(request.action);
			sendResponse({status: "success"});
			break;
	}
	return true;
});
