import { useState } from 'react';
import { Folder, FileText } from 'lucide-react';
import Terminal from './components/Terminal';
import ErrorModal from './components/ErrorModal';
import SuccessModal from './components/SuccessModal';
import Taskbar from './components/Taskbar';
import Window from './components/Window';

export default function App() {
	const [isSystemCrashed, setIsSystemCrashed] = useState(true);
	const [openWindows, setOpenWindows] = useState<string[]>([]);

	const [gameLevel, setGameLevel] = useState(1);
	const [completedLevelAlert, setCompletedLevelAlert] = useState<number | null>(null);

	const handleAcknowledgeError = () => {
		setIsSystemCrashed(false);
	};

	const handleAcknowledgeSuccess = () => {
		if (completedLevelAlert === 1) openWindow('level-2');
		if (completedLevelAlert === 2) openWindow('level-3');
		setCompletedLevelAlert(null);
	};

	const openWindow = (id: string) => {
		if (!openWindows.includes(id)) {
			setOpenWindows([...openWindows, id]);
		}
	};

	const closeWindow = (id: string) => {
		setOpenWindows(openWindows.filter(windowId => windowId !== id));
	};

	const handleSystemUpdate = (action: string, target: string) => {
		if (gameLevel === 1 && action === 'rm' && target === 'corrupted_file.sys') {
			setGameLevel(2);
			setCompletedLevelAlert(1);
			closeWindow('level-1');
		}

		if (gameLevel === 2 && action === 'mv' && target === 'display.dll') {
			setGameLevel(3);
			setCompletedLevelAlert(2);
			closeWindow('level-2');
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col scanlines">

			{isSystemCrashed && <ErrorModal onAcknowledge={handleAcknowledgeError} />}

			{completedLevelAlert !== null && (
				<SuccessModal level={completedLevelAlert} onAcknowledge={handleAcknowledgeSuccess} />
			)}

			<div className="flex-1 relative p-4">

				<div className="flex flex-col items-center w-20 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-4 left-4">
					<Folder size={40} className="fill-yellow-400 text-yellow-600" />
					<span className="bg-win-blue px-1 text-sm shadow-sm">My System</span>
				</div>

				{!isSystemCrashed && (
					<div
						className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-28 left-4"
						onDoubleClick={() => openWindow('level-1')}
					>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">level-1.txt</span>
					</div>
				)}

				{!isSystemCrashed && gameLevel >= 2 && (
					<div
						className="flex flex-col items-center w-28 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-52 left-2"
						onDoubleClick={() => openWindow('level-2')}
					>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm text-center">level-2.txt</span>
					</div>
				)}

				<Terminal onSystemUpdate={handleSystemUpdate} />

				{/* Level 1 Window */}
				{openWindows.includes('level-1') && (
					<Window
						title="level-1.txt - Notepad"
						content={`SYSTEM DIAGNOSTICS LOG:\n\nThe boot sector is corrupted. Manual intervention required.\n\n1. Open the terminal.\n2. Navigate to the C:\\System\\Boot directory.\n3. Delete the corrupted file.`}
						hints={[
							"The command line has a built-in manual. Run 'man [command-name]' to see what a command does. Try running 'man rm' or 'man cd'.",
							"Exact commands to run:\n\ncd System\ncd Boot\nrm corrupted_file.sys"
						]}
						onClose={() => closeWindow('level-1')}
					/>
				)}

				{/* Level 2 Window */}
				{openWindows.includes('level-2') && (
					<Window
						title="level-2.txt - Notepad"
						content={`SYSTEM ALERT: Visual Drivers unorganized.\n\nThe main display driver 'display.dll' was incorrectly saved to the C:\\Downloads folder.\n\n1. Navigate to C:\\Downloads\n2. Create a new folder named 'Graphics'\n3. Move 'display.dll' into the 'Graphics' folder.`}
						hints={[
							"Use 'mkdir [folder-name]' to create a new folder.",
							"Use 'mv [file-name] [folder-name]' to move a file into a folder.",
							"Exact commands:\n\ncd C:\ncd Downloads\nmkdir Graphics\nmv display.dll Graphics"
						]}
						onClose={() => closeWindow('level-2')}
					/>
				)}

			</div>

			<Taskbar />
		</div>
	);
}