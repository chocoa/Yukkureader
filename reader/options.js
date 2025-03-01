const settings = chrome.storage.local;


// 速度（-1:棒読みちゃん画面上の設定）50-200
const voice_speed = document.getElementById('voice_speed')
voice_speed.addEventListener('change', () => {
	settings.set({ voice_speed: voice_speed.value }).then((s) => { console.log(s) })
}, false)
settings.get('voice_speed').then((s) => { voice_speed.value = s.voice_speed })


// 速度-本体設定使用
const voice_speed_def = document.getElementById('voice_speed_def')
voice_speed_def.addEventListener('change', () => {
	settings.set({ voice_speed_def: (voice_speed_def.checked == true) ? 1 : 0 })
}, false)
settings.get('voice_speed_def').then((s) => { voice_speed_def.checked = (s.voice_speed_def == 1) })


// 音程（-1:棒読みちゃん画面上の設定）50-200
const voice_pitch = document.getElementById('voice_pitch')
voice_pitch.addEventListener('change', () => {
	settings.set({ voice_pitch: voice_pitch.value })
}, false)
settings.get('voice_pitch').then((s) => { voice_pitch.value = s.voice_pitch })


// 音程-本体設定使用
const voice_pitch_def = document.getElementById('voice_pitch_def')
voice_pitch_def.addEventListener('change', () => {
	settings.set({ voice_pitch_def: (voice_pitch_def.checked == true) ? 1 : 0 })
}, false)
settings.get('voice_pitch_def').then((s) => { voice_pitch_def.checked = (s.voice_pitch_def == 1) })


// 音量（-1:棒読みちゃん画面上の設定）0-100
const voice_volume = document.getElementById('voice_volume')
voice_volume.addEventListener('change', () => {
	settings.set({ voice_volume: voice_volume.value })
}, false)
settings.get('voice_volume').then((s) => { voice_volume.value = s.voice_volume })


// 音量-本体設定使用
const voice_volume_def = document.getElementById('voice_volume_def')
voice_volume_def.addEventListener('change', () => {
	settings.set({ voice_volume_def: ((voice_volume_def.checked == true) ? 1 : 0) })
}, false)
settings.get('voice_volume_def').then((s) => { voice_volume_def.checked = (s.voice_volume_def == 1) })


// 声質（ 0:棒読みちゃん画面上の設定、1:女性1、2:女性2、3:男性1、4:男性2、5:中性、6:ロボット、7:機械1、8:機械2、10001～:SAPI5）
const voice_type = document.getElementById('voice_type')
voice_type.addEventListener('change', () => {
	settings.set({ voice_type: voice_type.value })
}, false)
settings.get('voice_type').then((s) => { voice_type.selectedIndex = s.voice_type - 1 })


// 声質-本体設定使用
const voice_type_def = document.getElementById('voice_type_def')
voice_type_def.addEventListener('change', () => {
	settings.set({ voice_type_def: ((voice_type_def.checked == true) ? 1 : 0) })
}, false)
settings.get('voice_type_def').then((s) => { voice_type_def.checked = (s.voice_type_def == 1) })


// テストトーク
const talknow = document.getElementById('talktest')
talknow.addEventListener('click', async () => {
	let talk = document.getElementById('talk').value
	// メッセージを送信
	chrome.runtime.sendMessage({
		action: "test_talk",
		text: talk
	});
}, false)


// ポート番号
const port_number = document.getElementById('port_number')
port_number.addEventListener('change', () => {
	settings.set({ port_number: port_number.value })
}, false)

// 初期値の設定
settings.get("port_number").then((result) => {
	if (!result.port_number) {
		settings.set({ port_number: 55000 })
	} else {
		port_number.value = result.port_number
	}
})

