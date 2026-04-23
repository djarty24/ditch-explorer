import { Terminal } from 'lucide-react';

export default function Taskbar() {
	return (
		<div className="h-10 bg-win-gray border-t-2 border-white flex items-center px-1 gap-2 shadow-[0_-1px_2px_rgba(0,0,0,0.2)] relative z-50">

			<button className="flex items-center gap-2 bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black px-2 py-1 font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-sm">
				<div className="flex flex-wrap w-4 h-4 gap-[1px]">
					<div className="w-1.5 h-1.5 bg-red-500"></div>
					<div className="w-1.5 h-1.5 bg-green-500"></div>
					<div className="w-1.5 h-1.5 bg-blue-500"></div>
					<div className="w-1.5 h-1.5 bg-yellow-500"></div>
				</div>
				Start
			</button>

			<div className="bg-white border-t-black border-l-black border-b-white border-r-white border-2 px-3 py-1 text-sm font-bold shadow-inner flex items-center gap-2 text-gray-600">
				<Terminal size={14} />
				cmd.exe
			</div>

		</div>
	);
}