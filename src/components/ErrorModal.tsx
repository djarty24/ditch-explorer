import { XCircle } from 'lucide-react';

interface Props {
	onAcknowledge: () => void;
}

export default function ErrorModal({ onAcknowledge }: Props) {
	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
			<div className="w-100 bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black shadow-[2px_2px_0px_rgba(0,0,0,0.5)] flex flex-col">

				<div className="bg-win-blue text-white flex justify-between items-center px-1 py-1 font-bold tracking-wide">
					<span className="text-sm">System Error</span>
					<button onClick={onAcknowledge} className="bg-win-gray text-black border-t-white border-l-white border-b-black border-r-black border-2 px-2 pb-1 text-xs font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
						X
					</button>
				</div>

				<div className="p-4 flex gap-4 items-start">
					<XCircle size={48} className="text-red-600 fill-white shrink-0" />
					<div className="text-black text-sm">
						<p className="font-bold mb-2">FATAL ERROR DETECTED</p>
						<p className="mb-4">This computer has crashed. You must use the Emergency Command Prompt to restore the system.</p>

						<div className="flex justify-center">
							<button
								onClick={onAcknowledge}
								className="bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black px-8 py-1 active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-dotted focus:outline-1 focus:outline-offset-[-4px]"
							>
								OK
							</button>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}