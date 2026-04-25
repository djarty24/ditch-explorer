import { useState } from 'react';
import { Folder, FileText } from 'lucide-react';
import Terminal from './components/Terminal';
import ErrorModal from './components/ErrorModal';
import SuccessModal from './components/SuccessModal';
import MalwareModal from './components/MalwareModal';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import BootSequence from './components/BootSequence';
import { playSound } from './utils/soundEngine';

export default function App() {
	const [isBooting, setIsBooting] = useState(true);
	const [isSystemCrashed, setIsSystemCrashed] = useState(true);
	const [openWindows, setOpenWindows] = useState<string[]>([]);
	const [showLevel1Hint, setShowLevel1Hint] = useState(true);

	const [gameLevel, setGameLevel] = useState(1);
	const [completedLevelAlert, setCompletedLevelAlert] = useState<number | null>(null);
	const [showMalwarePopup, setShowMalwarePopup] = useState(false);

	const handleAcknowledgeError = () => {
		setIsSystemCrashed(false);
		playSound('startup');
	};

	const handleAcknowledgeSuccess = () => {
		if (completedLevelAlert === 1) openWindow('level-2');
		if (completedLevelAlert === 2) openWindow('level-3');
		if (completedLevelAlert === 3) openWindow('level-4');
		if (completedLevelAlert === 4) setShowMalwarePopup(true);
		setCompletedLevelAlert(null);
	};

	const handleAcknowledgeMalware = () => {
		setShowMalwarePopup(false);
		openWindow('level-5');
	};

	const focusWindow = (id: string) => {
		setOpenWindows(prev => {
			if (prev[prev.length - 1] === id) return prev;
			return [...prev.filter(w => w !== id), id];
		});
	};

	const openWindow = (id: string) => {
		if (id === 'level-1') setShowLevel1Hint(false);
		focusWindow(id);
	};

	const closeWindow = (id: string) => setOpenWindows(openWindows.filter(windowId => windowId !== id));

	const handleSystemUpdate = (action: string, target: string, path: string[]) => {
		if (gameLevel === 1 && action === 'rm' && target === 'corrupted_file.sys') {
			setGameLevel(2); setCompletedLevelAlert(1); closeWindow('level-1');
			playSound('success');
		}
		if (gameLevel === 2 && action === 'mv' && target === 'display.dll') {
			setGameLevel(3); setCompletedLevelAlert(2); closeWindow('level-2');
			playSound('success');
		}
		if (gameLevel === 3 && action === 'ping' && target === 'server') {
			setGameLevel(4); setCompletedLevelAlert(3); closeWindow('level-3');
			playSound('success');
		}
		if (gameLevel === 4 && action === 'login' && target === 'success') {
			setGameLevel(5); setCompletedLevelAlert(4); closeWindow('level-4');
			playSound('success');
		}
		if (gameLevel === 5 && action === 'rm' && target === 'dolphin_eradicated') {
			if (path[path.length - 1] === 'Trap') {
				setGameLevel(6); setCompletedLevelAlert(5); closeWindow('level-5');
				playSound('success');
			}
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col scanlines">
			{isBooting ? (
				<BootSequence onComplete={() => setIsBooting(false)} />
			) : (
				<>
					{isSystemCrashed && <ErrorModal onAcknowledge={handleAcknowledgeError} />}
					{completedLevelAlert !== null && <SuccessModal level={completedLevelAlert} onAcknowledge={handleAcknowledgeSuccess} />}
					{showMalwarePopup && <MalwareModal onAcknowledge={handleAcknowledgeMalware} />}

					<div className="flex-1 relative p-4">

						<div className="flex flex-col items-center w-20 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-4 left-4">
							<Folder size={40} className="fill-yellow-400 text-yellow-600" />
							<span className="bg-win-blue px-1 text-sm shadow-sm">My System</span>
						</div>

						{!isSystemCrashed && (
							<div className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-4 right-4" onDoubleClick={() => openWindow('about-me')}>
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

						{!isSystemCrashed && gameLevel >= 5 && (
							<div className="flex flex-col items-center w-24 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded absolute top-[31rem] left-4" onDoubleClick={() => openWindow('level-5')}>
								<FileText size={40} className="text-white fill-white" />
								<span className="bg-win-blue px-1 text-sm shadow-sm bg-red-600">level-5.txt</span>
							</div>
						)}

						<Terminal onSystemUpdate={handleSystemUpdate} />

						{openWindows.includes('about-me') && (
							<Window
								title="About_Me.txt - Notepad"
								content={`Hi! I created Ditch Explorer to...\n\n`}
								onClose={() => closeWindow('about-me')}
								positionClass="top-10 right-10 left-auto"
								zIndex={40 + openWindows.indexOf('about-me')}
								onFocus={() => focusWindow('about-me')}
							/>
						)}

						{openWindows.includes('level-1') && (
							<Window
								title="level-1.txt - Notepad"
								content={`SYSTEM ALERT: Start-up error.\n\nThere is a broken file stopping the computer from starting up properly. We need to throw it in the trash.\n\n1. Open the terminal.\n2. Go into the C:\\System\\Boot folder.\n3. Delete the file named 'corrupted_file.sys'.`}
								hints={["The command line has a built-in manual. Run 'man [command-name]' to see what a command does.", "Exact commands:\ncd System\ncd Boot\nrm corrupted_file.sys"]}
								onClose={() => closeWindow('level-1')}
								zIndex={40 + openWindows.indexOf('level-1')}
								onFocus={() => focusWindow('level-1')}
							/>
						)}

						{openWindows.includes('level-2') && (
							<Window
								title="level-2.txt - Notepad"
								content={`SYSTEM ALERT: Screen glitch detected.\n\nThe computer's screen is glitching because an important display file was accidentally saved in the wrong place.\n\n1. Go to the C:\\Downloads folder.\n2. Create a brand new folder named 'Graphics'\n3. Move the 'display.dll' file into that new 'Graphics' folder.`}
								hints={["Use 'mkdir [folder-name]' to create a new folder.", "Exact commands:\ncd C:\\\ncd Downloads\nmkdir Graphics\nmv display.dll Graphics"]}
								onClose={() => closeWindow('level-2')}
								zIndex={40 + openWindows.indexOf('level-2')}
								onFocus={() => focusWindow('level-2')}
							/>
						)}

						{openWindows.includes('level-3') && (
							<Window
								title="level-3.txt - Notepad"
								content={`SYSTEM ALERT: Internet disconnected.\n\nThe screen is fixed, but the computer is offline. We need to check if the main internet server is awake by sending it a quick test signal.\n\n1. Open the terminal.\n2. Use the ping command to check the 'server'.`}
								hints={["The 'ping' command sends a small test signal to another computer.", "Exact command:\nping server"]}
								onClose={() => closeWindow('level-3')}
								zIndex={40 + openWindows.indexOf('level-3')}
								onFocus={() => focusWindow('level-3')}
							/>
						)}

						{openWindows.includes('level-4') && (
							<Window
								title="level-4.txt - Notepad"
								content={`SYSTEM ALERT: Security Lockout.\n\nThe internet is working, but we need the administrator password to download the final fix. It is hidden somewhere inside a messy log file.\n\n1. Go to the C:\\System\\Logs folder.\n2. Search the file named 'server_logs.txt' to find the password.\n3. Type 'login [the password you found]' to unlock the computer.`}
								hints={["Use 'cat [file-name]' to read a file, or 'grep [word] [file-name]' to search inside it.", "Exact commands:\ncd C:\\\ncd System\ncd Logs\ncat server_logs.txt\nlogin hackclub_rules"]}
								onClose={() => closeWindow('level-4')}
								zIndex={40 + openWindows.indexOf('level-4')}
								onFocus={() => focusWindow('level-4')}
							/>
						)}

						{openWindows.includes('level-5') && (
							<Window
								title="level-5.txt - Notepad"
								content={`CRITICAL ALERT: VIRUS INFECTION.\n\nDolphin.exe has hijacked the computer. You must hunt it down and delete it to save the system.\n\n1. Search the 'network_log.txt' file in the C:\\ folder for the word 'dolphin' to find out where it is hiding.\n2. Go to the folder where it is hiding.\n3. Do NOT delete it immediately! It will just clone itself. You must create a new folder named 'Trap'.\n4. Move 'dolphin.exe' into the 'Trap' folder.\n5. Go inside the 'Trap' folder and delete the virus.`}
								hints={["If you spawn clones, you must delete all of them inside the Trap folder to win!", "Exact commands:\ncd C:\\\ngrep dolphin network_log.txt\ncd Downloads\nmkdir Trap\nmv dolphin.exe Trap\ncd Trap\nrm dolphin.exe"]}
								onClose={() => closeWindow('level-5')}
								zIndex={40 + openWindows.indexOf('level-5')}
								onFocus={() => focusWindow('level-5')}
							/>
						)}

					</div>
					<Taskbar />
				</>
			)}
		</div>
	);
}