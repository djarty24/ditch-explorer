import { useState, useEffect } from 'react';

interface BootSequenceProps {
	onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
	const [lines, setLines] = useState<string[]>([]);

	useEffect(() => {
		const sequence = [
			"Orpheus BIOS PLUS Version 4.0",
			"Copyright (c) Hack Club Sleepover",
			"All Rights Reserved",
			"",
			"CPU = Caffeine-Overclocked Mainframe",
			"Sleeping Bag Matrix........ OK",
			"Midnight Pizza Levels...... OPTIMAL",
			"Energy Drink Cache......... 100%",
			"",
			"Mechanical keyboard clacks detected.",
			"Mounting late-night ideas...",
			"Connecting to the Sleepover LAN...",
			"",
			"Booting from Hack Club Server...",
			"Starting DitchOS..."
		];

		let currentIndex = 0;

		const interval = setInterval(() => {
			if (currentIndex < sequence.length) {
				setLines((prev) => [...prev, sequence[currentIndex]]);
				currentIndex++;
			} else {
				clearInterval(interval);
				setTimeout(onComplete, 1200);
			}
		}, 150);

		return () => clearInterval(interval);
	}, [onComplete]);

	return (
		<div className="absolute inset-0 bg-black z-[200] p-4 font-mono text-gray-300 text-sm flex flex-col w-full h-full">
			{lines.map((line, i) => (
				<div key={i} className="min-h-[1.25rem] whitespace-pre-wrap">{line}</div>
			))}
			<div className="animate-pulse w-2 h-4 bg-gray-300 mt-1"></div>
		</div> 
	);
}