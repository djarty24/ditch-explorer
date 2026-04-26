import { useState } from 'react';

interface NamePromptModalProps {
	onSubmit: (name: string) => void;
}

export default function NamePromptModal({ onSubmit }: NamePromptModalProps) {
	const [name, setName] = useState('');

	return (
		<div className="absolute inset-0 z-100 flex items-center justify-center bg-black/40">
			<div className="w-100 bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)] flex flex-col">

				<div className="bg-win-blue text-white flex items-center px-2 py-1 font-bold tracking-wide text-sm">
					User Identification Required
				</div>

				<div className="p-4 flex flex-col gap-4 text-black">
					<p className="font-bold text-sm">System Secure. Threat Eradicated.</p>
					<p className="text-sm">Please enter your name for the official Hack Club record. Leave blank to remain anonymous.</p>

					<input
						autoFocus
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="border-t-black border-l-black border-b-white border-r-white border-2 p-1 font-mono text-sm outline-none bg-white text-black"
						placeholder="Enter name..."
						onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(name); }}
					/>

					<div className="flex justify-end mt-2">
						<button
							onClick={() => onSubmit(name)}
							className="bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black px-6 py-1 font-bold text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
						>
							Issue Award
						</button>
					</div>
				</div>

			</div>
		</div>
	);
}