let settings = chrome.storage.local;

// メニュークリックのイベント
chrome.contextMenus.onClicked.addListener(onClickRead);

function onClickRead(info) {
	switch (info.menuItemId) {
		case "read":
			bouyomi_talk(info.selectionText);
			break;
		default:
			console.log("Standard context menu item clicked.");
	}
}

// メニューの登録
chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		title: "読み上げる",
		contexts: ['all'],
		id: "read"
	});
})

// 棒読みちゃんに喋らせる
async function bouyomi_talk(text) {
	// 設定値の取得
	let speed = (await settings.get("voice_speed")).voice_speed;
	let speed_def = (await settings.get("voice_speed_def")).voice_speed_def;
	speed = speed_def ? -1 : parseInt(speed);

	let pitch = (await settings.get("voice_pitch")).voice_pitch;
	let pitch_def = (await settings.get("voice_pitch_def")).voice_pitch_def;
	pitch = pitch_def ? -1 : parseInt(pitch);

	let volume = (await settings.get("voice_volume")).voice_volume;
	let volume_def = (await settings.get("voice_volume_def")).voice_volume_def;
	volume = volume_def ? -1 : parseInt(volume);

	let vtype = (await settings.get("voice_type")).voice_type;
	let type_def = (await settings.get("voice_type_def")).voice_type_def;
	vtype = type_def ? 0 : parseInt(vtype);

	// ポート番号を取得
	let port = (await settings.get("port_number")).port_number || 55000;

	// テキストのエスケープ処理
	const escapedText = text
		.replace(/[\\]/g, '\\\\')    // バックスラッシュ
		.replace(/[\"]/g, '\\"')     // ダブルクォート
		.replace(/[\b]/g, '\\b')     // バックスペース
		.replace(/[\f]/g, '\\f')     // フォームフィード
		.replace(/[\n]/g, '\\n')     // 改行
		.replace(/[\r]/g, '\\r')     // キャリッジリターン
		.replace(/[\t]/g, '\\t');    // タブ

	// JSONデータの作成
	const data = {
		speed: speed,
		pitch: pitch,
		volume: volume,
		voiceType: vtype,
		text: escapedText
	};

	// 棒読みちゃんに送信
	let socket = new WebSocket(`ws://localhost:${port}/`);
	socket.onopen = (event) => {
		socket.send(JSON.stringify(data));
	};
}

// メッセージリスナーを追加
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "test_talk") {
        bouyomi_talk(request.text);
        sendResponse({status: "success"});
    }
    return true;
});
