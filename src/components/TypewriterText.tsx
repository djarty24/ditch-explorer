import { useState, useEffect } from 'react';

interface Props {
	text: string;
	delay?: number;
	onComplete?: () => void;
}

export default function TypewriterText({ text, delay = 15, onComplete }: Props) {
	const [displayedText, setDisplayedText] = useState('');

	useEffect(() => {
		let index = 0;
		const timer = setInterval(() => {
			setDisplayedText(text.slice(0, index));
			index++;

			if (index > text.length) {
				clearInterval(timer);
				if (onComplete) onComplete();
			}
		}, delay);

		return () => clearInterval(timer);
	}, [text, delay, onComplete]);

	return <span>{displayedText}</span>;
}