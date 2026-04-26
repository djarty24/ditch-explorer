import { useRef } from 'react';
import Draggable from 'react-draggable';

interface CertificateWindowProps {
	playerName: string;
	onClose: () => void;
	zIndex?: number;
	onFocus?: () => void;
}

export default function CertificateWindow({ playerName, onClose, zIndex, onFocus }: CertificateWindowProps) {
	const nodeRef = useRef<HTMLDivElement>(null);

	return (
		<Draggable nodeRef={nodeRef} handle=".window-handle" bounds="parent">
			<div
				ref={nodeRef}
				onMouseDown={onFocus}
				style={{ zIndex: zIndex || 50 }}
				className="absolute top-10 left-10 sm:left-1/4 w-125 bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col"
			>
				<div className="window-handle bg-win-blue text-white flex justify-between items-center px-1 py-1 font-bold tracking-wide cursor-move">
					<span className="text-sm">Certificate.exe</span>
					<button onClick={onClose} className="bg-win-gray text-black border-t-white border-l-white border-b-black border-r-black border-2 px-2 pb-1 text-xs font-bold cursor-default active:border-t-black active:border-l-black active:border-b-white active:border-r-white">X</button>
				</div>

				<div className="p-4 bg-white border-t-black border-l-black border-b-white border-r-white border-2 m-1">
					<div className="border-8 border-double border-yellow-500 p-8 text-center flex flex-col items-center bg-yellow-50">
						<h1 className="text-4xl font-serif font-bold text-red-700 mb-2 drop-shadow-md">CERTIFICATE</h1>
						<h2 className="text-xl font-serif text-gray-700 tracking-widest mb-6">OF EXCELLENCE</h2>

						<p className="text-sm italic text-gray-600 mb-4">This officially certifies that</p>

						<p className="text-3xl font-bold font-serif text-blue-900 border-b-2 border-gray-400 pb-2 mb-6 w-full">
							{playerName}
						</p>

						<p className="text-sm font-serif text-gray-800 leading-relaxed mb-8">
							has successfully navigated the DitchOS Terminal, eradicated the Dolphin.exe malware, and secured the Hack Club Sleepover LAN.
						</p>

						<div className="flex justify-between w-full text-xs font-bold text-gray-500">
							<div>DATE: 1998</div>
							<div>SIGNED: Orpheus</div>
						</div>
					</div>
				</div>
			</div>
		</Draggable>
	);
}