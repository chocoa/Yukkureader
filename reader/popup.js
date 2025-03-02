/**
 * ゆっくりーだー ポップアップスクリプト
 * 
 * 読み上げの制御コマンドを送信するためのポップアップUIを提供します。
 */

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
	// 各ボタンの要素を取得
	const stopButton = document.getElementById('stop-button');
	const pauseButton = document.getElementById('pause-button');
	const resumeButton = document.getElementById('resume-button');
	const skipButton = document.getElementById('skip-button');
	const optionsButton = document.getElementById('options-button');
	const openOptionsLink = document.getElementById('open-options');
	
	// 停止ボタンのイベントリスナー
	stopButton.addEventListener('click', () => {
		sendCommand('stop');
	});
	
	// 一時停止ボタンのイベントリスナー
	pauseButton.addEventListener('click', () => {
		sendCommand('pause');
	});
	
	// 再開ボタンのイベントリスナー
	resumeButton.addEventListener('click', () => {
		sendCommand('resume');
	});
	
	// スキップボタンのイベントリスナー
	skipButton.addEventListener('click', () => {
		sendCommand('skip');
	});
	
	// 設定ボタンのイベントリスナー
	optionsButton.addEventListener('click', () => {
		chrome.runtime.openOptionsPage();
	});
	
	// 詳細設定リンクのイベントリスナー
	openOptionsLink.addEventListener('click', (e) => {
		e.preventDefault();
		chrome.runtime.openOptionsPage();
	});
});

/**
 * バックグラウンドスクリプトにコマンドを送信する
 * @param {string} command - 送信するコマンド (stop/pause/resume/skip)
 */
function sendCommand(command) {
	chrome.runtime.sendMessage({
		action: command
	}, (response) => {
		if (chrome.runtime.lastError) {
			console.error('メッセージ送信エラー:', chrome.runtime.lastError);
			return;
		}
	});
} 