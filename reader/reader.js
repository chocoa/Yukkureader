var settings = localStorage;
// デフォルト
if(!settings.voice_speed)	settings.voice_speed = -1;					// 棒読みちゃん速度
if(!settings.voice_pitch)	settings.voice_pitch = -1;					// 棒読みちゃん音程
if(!settings.voice_volume)	settings.voice_volume = -1;					// 棒読みちゃん音量
if(!settings.voice_type)	settings.voice_type = 0;					// 棒読みちゃんタイプ

// 右クリックメニューを追加
function registerMenu() {
	var menu_id = chrome.contextMenus.create({
		"title" : "読み上げる",
		"type" : "normal",
		"contexts" : ["all"],
		"onclick" : onClickRead()
	});
};

// 読み上げボタンがクリックされた時
function onClickRead() {
	return function(info, tab) {
		bouyomi_talk(info.selectionText);
	};
};

// 棒読みちゃんに喋らせる
function bouyomi_talk(text)
{
	var delim = "<bouyomi>";
	var speed = (settings.voice_speed_def == true) ? -1 : settings.voice_speed;
	var pitch = (settings.voice_pitch_def == true) ? -1 : settings.voice_pitch;
	var volume = (settings.voice_volume_def == true) ? -1 : settings.voice_volume;
	var type = (settings.voice_type_def == true) ? 0 : settings.voice_type;
	var sends = "" + speed + delim + pitch + delim + volume + delim + type + delim + text;
	// 棒読みちゃんに送信
	var socket = new WebSocket('ws://localhost:50002/');
	socket.onopen = function() {
		socket.send(sends);
	}
}
