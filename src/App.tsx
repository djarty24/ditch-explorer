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

	const handleAcknowledgeError = () => setIsSystemCrashed(false);

	const handleAcknowledgeSuccess = () => {
		if (completedLevelAlert === 1) openWindow('level-2');
		if (completedLevelAlert === 2) openWindow('level-3');
		if (completedLevelAlert === 3) openWindow('level-4');
		setCompletedLevelAlert(null);
	};

	const openWindow = (id: string) => {
		if (!openWindows.includes(id)) setOpenWindows([...openWindows, id]);
	};
	const closeWindow = (id: string) => setOpenWindows(openWindows.filter(windowId => windowId !== id));

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
		if (gameLevel === 3 && action === 'ping' && target === 'mainframe') {
			setGameLevel(4);
			setCompletedLevelAlert(3);
			closeWindow('level-3');
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col scanlines">
			{isSystemCrashed && <ErrorModal onAcknowledge={handleAcknowledgeError} />}
			{completedLevelAlert !== null && <SuccessModal level={completedLevelAlert} onAcknowledge={handleAcknowledgeSuccess} />}

			<div className="flex-1 relative p-4">

				<div className="flex flex-col items-center w-20 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-4 left-4">
					<Folder size={40} className="fill-yellow-400 text-yellow-600" />
					<span className="bg-win-blue px-1 text-sm shadow-sm">My System</span>
				</div>

				{!isSystemCrashed && (
					<div
						className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-4 right-4"
						onDoubleClick={() => openWindow('about-me')}
					>
						<Folder size={40} className="fill-blue-500 text-blue-700" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">About Me</span>
					</div>
				)}

				{!isSystemCrashed && (
					<div className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-28 left-4" onDoubleClick={() => openWindow('level-1')}>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">level-1.txt</span>
					</div>
				)}

				{!isSystemCrashed && gameLevel >= 2 && (
					<div className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-52 left-4" onDoubleClick={() => openWindow('level-2')}>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">level-2.txt</span>
					</div>
				)}

				{!isSystemCrashed && gameLevel >= 3 && (
					<div className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-[19rem] left-4" onDoubleClick={() => openWindow('level-3')}>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">level-3.txt</span>
					</div>
				)}

				<Terminal onSystemUpdate={handleSystemUpdate} />

				{openWindows.includes('about-me') && (
					<Window
						title="About_Me.txt - Notepad"
						content={`Hi! I created Ditch Explorer to...\n\n[ I'll add a bit more about myself here later!]`}
						onClose={() => closeWindow('about-me')}
					/>
				)}

				{/* Level 1 Window */}
				{openWindows.includes('level-1') && (<Window title="level-1.txt - Notepad" content={`...`} hints={["..."]} onClose={() => closeWindow('level-1')} />)}
				
				{/* Level 2 Window */}
				{openWindows.includes('level-2') && (<Window title="level-2.txt - Notepad" content={`...`} hints={["..."]} onClose={() => closeWindow('level-2')} />)}
s
				{/* Level 3 Window */}
				{openWindows.includes('level-3') && (
					<Window
						title="level-3.txt - Notepad"
						content={`SYSTEM ALERT: Mainframe Disconnected.\n\nThe visual drivers are restored, but the system cannot access the network. We must re-establish the connection to the 'mainframe' to download the final patch.\n\n1. Open the terminal.\n2. Send a ping to the 'mainframe'.`}
						hints={[
							"The 'ping' command checks if a server is online.",
							"Exact command:\n\nping mainframe"
						]}
						onClose={() => closeWindow('level-3')}
					/>
				)}

			</div>
			<Taskbar />
		</div>
	);
}