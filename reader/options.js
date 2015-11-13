window.onload = function(){
	// 速度（-1:棒読みちゃん画面上の設定）50-200
	var voice_speed = document.getElementById('voice_speed');
	voice_speed.addEventListener('change', function(){
		settings.voice_speed = voice_speed.value;
	}, false);
	voice_speed.value = settings.voice_speed;
	
	// 速度-本体設定使用
	var voice_speed_def = document.getElementById('voice_speed_def');
	voice_speed_def.addEventListener('change', function(){
		settings.voice_speed_def = (voice_speed_def.checked == true) ? 1 : 0;
	}, false);
	voice_speed_def.checked = (settings.voice_speed_def == 1);
	
	// 音程（-1:棒読みちゃん画面上の設定）50-200
	var voice_pitch = document.getElementById('voice_pitch');
	voice_pitch.addEventListener('change', function(){
		settings.voice_pitch = voice_pitch.value;
	}, false);
	voice_pitch.value = settings.voice_pitch;
	
	// 音程-本体設定使用
	var voice_pitch_def = document.getElementById('voice_pitch_def');
	voice_pitch_def.addEventListener('change', function(){
		settings.voice_pitch_def = (voice_pitch_def.checked == true) ? 1 : 0;
	}, false);
	voice_pitch_def.checked = (settings.voice_pitch_def == 1);
	
	// 音量（-1:棒読みちゃん画面上の設定）0-100
	var voice_volume = document.getElementById('voice_volume');
	voice_volume.addEventListener('change', function(){
		settings.voice_volume = voice_volume.value;
	}, false);
	voice_volume.value = settings.voice_volume;
	
	// 音量-本体設定使用
	var voice_volume_def = document.getElementById('voice_volume_def');
	voice_volume_def.addEventListener('change', function(){
		settings.voice_volume_def = (voice_volume_def.checked == true) ? 1 : 0;
	}, false);
	voice_volume_def.checked = (settings.voice_volume_def == 1);
	
	// 声質（ 0:棒読みちゃん画面上の設定、1:女性1、2:女性2、3:男性1、4:男性2、5:中性、6:ロボット、7:機械1、8:機械2、10001～:SAPI5）
	var voice_type = document.getElementById('voice_type');
	voice_type.addEventListener('change', function(){
		settings.voice_type = voice_type.value;
	}, false);
	voice_type.selectedIndex = settings.voice_type - 1;
	
	// 声質-本体設定使用
	var voice_type_def = document.getElementById('voice_type_def');
	voice_type_def.addEventListener('change', function(){
		settings.voice_type_def = (voice_type_def.checked == true) ? 1 : 0;
	}, false);
	voice_type_def.checked = (settings.voice_type_def == 1);
	
	// テストトーク
	var talknow = document.getElementById('talktest');
	talknow.addEventListener('click', function(){
		var talk = document.getElementById('talk').value;
		bouyomi_talk(talk);
	}, false);

};


