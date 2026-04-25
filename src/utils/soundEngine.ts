const sounds = {
	startup: new Audio('/sounds/startup.mp3'),
	keypress: new Audio('/sounds/keypress.mp3'),
	error: new Audio('/sounds/error.mp3'),
	success: new Audio('/sounds/success.mp3'),
};

sounds.keypress.volume = 0.2;
sounds.startup.volume = 0.5;
sounds.success.volume = 0.5;
sounds.error.volume = 0.4;

export const playSound = (type: keyof typeof sounds) => {
	const sound = sounds[type];

	sound.currentTime = 0;

	sound.play().catch(() => {
		console.warn(`Audio blocked by browser: ${type}`);
	});
};