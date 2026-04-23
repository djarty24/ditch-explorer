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
	const [showLevel1Hint, setShowLevel1Hint] = useState(true);

	const [gameLevel, setGameLevel] = useState(1);
	const [completedLevelAlert, setCompletedLevelAlert] = useState<number | null>(null);

	const handleAcknowledgeError = () => setIsSystemCrashed(false);

	const handleAcknowledgeSuccess = () => {
		if (completedLevelAlert === 1) openWindow('level-2');
		if (completedLevelAlert === 2) openWindow('level-3');
		if (completedLevelAlert === 3) openWindow('level-4');
		if (completedLevelAlert === 4) openWindow('level-5');
		setCompletedLevelAlert(null);
	};

	const openWindow = (id: string) => {
		if (id === 'level-1') setShowLevel1Hint(false);
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
		if (gameLevel === 3 && action === 'ping' && target === 'server') {
			setGameLevel(4);
			setCompletedLevelAlert(3);
			closeWindow('level-3');
		}
		if (gameLevel === 4 && action === 'login' && target === 'success') {
			setGameLevel(5);
			setCompletedLevelAlert(4);
			closeWindow('level-4');
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
					<div className="absolute top-28 left-4 flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded" onDoubleClick={() => openWindow('level-1')}>
						{showLevel1Hint && (
							<div className="absolute -top-10 animate-bounce bg-yellow-200 border-2 border-black px-2 py-1 text-xs font-bold text-black shadow-md whitespace-nowrap">
								Click me first! ↓
							</div>
						)}
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

				{!isSystemCrashed && gameLevel >= 4 && (
					<div className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-[25rem] left-4" onDoubleClick={() => openWindow('level-4')}>
						<FileText size={40} className="text-white fill-white" />
						<span className="bg-win-blue px-1 text-sm shadow-sm">level-4.txt</span>
					</div>
				)}

				<Terminal onSystemUpdate={handleSystemUpdate} />

				{openWindows.includes('about-me') && (
					<Window
						title="About_Me.txt - Notepad"
						content={`Hi! I created Ditch Explorer to...\n\n[TBD]`}
						onClose={() => closeWindow('about-me')}
					/>
				)}

				{/* Level 1 Window */}
				{openWindows.includes('level-1') && (
					<Window
						title="level-1.txt - Notepad"
						content={`SYSTEM ALERT: Start-up error.\n\nThere is a broken file stopping the computer from starting up properly. We need to throw it in the trash.\n\n1. Open the terminal.\n2. Go into the C:\\System\\Boot folder.\n3. Delete the file named 'corrupted_file.sys'.`}
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
						content={`SYSTEM ALERT: Screen glitch detected.\n\nThe computer's screen is glitching because an important display file was accidentally saved in the wrong place.\n\n1. Go to the C:\\Downloads folder.\n2. Create a brand new folder named 'Graphics'\n3. Move the 'display.dll' file into that new 'Graphics' folder.`}
						hints={[
							"Use 'mkdir [folder-name]' to create a new folder.",
							"Use 'mv [file-name] [folder-name]' to move a file into a folder.",
							"Exact commands:\n\ncd C:\\\ncd Downloads\nmkdir Graphics\nmv display.dll Graphics"
						]}
						onClose={() => closeWindow('level-2')}
					/>
				)}

				{/* Level 3 Window */}
				{openWindows.includes('level-3') && (
					<Window
						title="level-3.txt - Notepad"
						content={`SYSTEM ALERT: Internet disconnected.\n\nThe screen is fixed, but the computer is offline. We need to check if the main internet server is awake by sending it a quick test signal.\n\n1. Open the terminal.\n2. Use the ping command to check the 'server'.`}
						hints={[
							"The 'ping' command sends a small test signal to another computer and waits for a reply to check if it is online and connected.",
							"Exact command:\n\nping server"
						]}
						onClose={() => closeWindow('level-3')}
					/>
				)}

				{/* Level 4 Window */}
				{openWindows.includes('level-4') && (
					<Window
						title="level-4.txt - Notepad"
						content={`SYSTEM ALERT: Security Lockout.\n\nThe internet is working, but we need the administrator password to download the final fix. It is hidden somewhere inside a messy log file.\n\n1. Go to the C:\\System\\Logs folder.\n2. Search the file named 'server_logs.txt' to find the password.\n3. Type 'login [the password you found]' to unlock the computer.`}
						hints={[
							"Use the 'cat [file-name]' command to print everything inside a text file so you can read it.",
							"If a file is too long to read easily, you can search for a specific word inside it using 'grep [word] [file-name]'. Try running 'grep password server_logs.txt'.",
							"Exact commands to run:\n\ncd C:\\\ncd System\ncd Logs\ncat server_logs.txt\nlogin hackclub_rules"
						]}
						onClose={() => closeWindow('level-4')}
					/>
				)}

			</div>
			<Taskbar />
		</div>
	);
}