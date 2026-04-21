import { useState } from 'react';
import { Folder, FileText } from 'lucide-react';
import Terminal from './components/Terminal';
import ErrorModal from './components/ErrorModal';
import Taskbar from './components/Taskbar';
import Window from './components/Window';

export default function App() {
	const [isSystemCrashed, setIsSystemCrashed] = useState(true);

	const [openWindows, setOpenWindows] = useState<string[]>([]);

	const handleAcknowledgeError = () => {
		setIsSystemCrashed(false);
	};

	const openWindow = (id: string) => {
		if (!openWindows.includes(id)) {
			setOpenWindows([...openWindows, id]);
		}
	};

	const closeWindow = (id: string) => {
		setOpenWindows(openWindows.filter(windowId => windowId !== id));
	};

	return (
		<div className="h-screen w-screen flex flex-col scanlines">

			{isSystemCrashed && <ErrorModal onAcknowledge={handleAcknowledgeError} />}

			<div className="flex-1 relative p-4 flex flex-col gap-4">

				<div className="flex flex-col items-center w-20 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded">
					<Folder size={40} className="fill-yellow-400 text-yellow-600" />
					<span className="bg-win-blue px-1 text-sm shadow-sm">My System</span>
				</div>

				{!isSystemCrashed && (
					<div
						className="flex flex-col items-center w-20 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded"
						onDoubleClick={() => openWindow('level-1')}
					>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">level-1.txt</span>
					</div>
				)}

				<Terminal />

				{openWindows.includes('level-1') && (
					<Window
						title="level-1.txt - Notepad"
						content={`SYSTEM DIAGNOSTICS LOG:

The boot sector is corrupted. Manual intervention required.

1. Open the terminal.
2. Navigate to the C:\\System\\Boot directory.
3. Delete the corrupted file.`}
						hints={[
							"The command line has a built-in manual. Run 'man [command-name]' to see what a command does. Try running 'man rm' or 'man cd'.",
							"Exact commands to run:\n\ncd System\ncd Boot\nrm corrupted_file.sys"
						]}
						onClose={() => closeWindow('level-1')}
					/>
				)}

			</div>

			<Taskbar />
		</div>
	);
}