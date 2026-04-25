import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import TypewriterText from './TypewriterText';

type FileNode = {
	type: 'DIR' | 'FILE';
	children?: Record<string, FileNode>;
	content?: string;
};

const initialFileSystem: Record<string, FileNode> = {
	'C:': {
		type: 'DIR',
		children: {
			'network_log.txt': { type: 'FILE', content: '[14:00] Normal traffic\n[14:01] Suspicious packet received\n[14:02] MALWARE DOWNLOADED TO: C:\\Downloads\n[14:03] dolphin.exe active' },
			'System': {
				type: 'DIR',
				children: {
					'Boot': {
						type: 'DIR',
						children: {
							'corrupted_file.sys': { type: 'FILE', content: '0xDEADBEEF FATAL CORRUPTION' }
						}
					},
					'Logs': {
						type: 'DIR',
						children: {
							'server_logs.txt': { type: 'FILE', content: '[08:00] Start boot sequence\n[08:01] Loading modules\n[08:02] Network connection attempt\n[08:03] Admin password set to: hackclub_rules\n[08:04] Sleep mode activated\n[08:05] End of log.' }
						}
					}
				}
			},
			'Downloads': {
				type: 'DIR',
				children: {
					'display.dll': { type: 'FILE', content: 'BINARY_DRIVER_DATA' },
					'dolphin.exe': { type: 'FILE', content: '101010100101010 I AM A DOLPHIN 101010101' }
				}
			}
		}
	}
};

type HistoryLine = {
	id: number;
	type: 'input' | 'output' | 'error' | 'system';
	text: string;
};

interface TerminalProps {
	onSystemUpdate?: (action: string, target: string, path: string[]) => void;
}

export default function Terminal({ onSystemUpdate }: TerminalProps) {
	const [input, setInput] = useState('');
	const [fileSystem, setFileSystem] = useState(initialFileSystem);
	const [currentPath, setCurrentPath] = useState<string[]>(['C:']);

	const [history, setHistory] = useState<HistoryLine[]>([
		{ id: 1, type: 'system', text: 'Microsoft(R) Windows 98' },
		{ id: 2, type: 'system', text: '(C)Copyright Microsoft Corp 1981-1999.' },
		{ id: 3, type: 'system', text: 'Initializing Emergency Command Prompt...' },
		{ id: 4, type: 'system', text: 'Type "help" to view available commands.' }
	]);

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [history]);

	const getCurrentDir = () => {
		let current: any = fileSystem;
		for (const folder of currentPath) {
			if (current[folder]?.children) {
				current = current[folder].children;
			} else if (current.children && current.children[folder]) {
				current = current.children[folder].children;
			}
		}
		return current;
	};

	const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			const trimmedInput = input.trim();
			if (!trimmedInput) return;

			const pathString = currentPath.join('\\') + '>';
			const newHistory: HistoryLine[] = [
				...history,
				{ id: Date.now(), type: 'input', text: `${pathString} ${trimmedInput}` }
			];

			const [cmd, ...args] = trimmedInput.split(' ');
			const currentDir = getCurrentDir();

			switch (cmd.toLowerCase()) {
				case 'help':
					newHistory.push({ id: Date.now() + 1, type: 'output', text: 'Available commands: help, clear, echo, ls, cd, rm, mkdir, mv, ping, cat, grep, login, man' });
					break;
				case 'clear':
					setHistory(history.slice(0, 4));
					setInput('');
					return;
				case 'echo':
					newHistory.push({ id: Date.now() + 1, type: 'output', text: args.join(' ') || ' ' });
					break;
				case 'ls':
					const items = Object.keys(currentDir);
					if (items.length === 0) {
						newHistory.push({ id: Date.now() + 1, type: 'output', text: '(empty directory)' });
					} else {
						items.forEach((item, index) => {
							const isDir = currentDir[item].type === 'DIR';
							const prefix = isDir ? '<DIR>  ' : '       ';
							newHistory.push({ id: Date.now() + index + 1, type: 'output', text: `${prefix} ${item}` });
						});
					}
					break;
				case 'cd':
					const target = args[0];
					if (!target) {
						newHistory.push({ id: Date.now() + 1, type: 'output', text: currentPath.join('\\') });
					} else {
						// NEW: Advanced Path Parsing
						let tempPath = [...currentPath];
						// Split by forward or backward slash
						let parts = target.split(/[/\\]+/).filter(Boolean);

						// Handle jumping straight to C:
						if (target.toUpperCase().startsWith('C:')) {
							tempPath = ['C:'];
							if (parts[0].toUpperCase() === 'C:') parts.shift();
						}

						let isError = false;
						let errorMsg = '';

						for (const part of parts) {
							if (part === '..') {
								if (tempPath.length > 1) tempPath.pop();
							} else if (part === '.') {
								continue;
							} else {
								let nav: any = fileSystem;
								for (const p of tempPath) {
									if (nav[p]?.children) nav = nav[p].children;
									else if (nav.children && nav.children[p]) nav = nav.children[p].children;
								}
								if (nav[part] && nav[part].type === 'DIR') {
									tempPath.push(part);
								} else if (nav[part] && nav[part].type === 'FILE') {
									isError = true;
									errorMsg = `cd: ${part}: Not a directory`;
									break;
								} else {
									isError = true;
									errorMsg = `cd: ${part}: No such file or directory`;
									break;
								}
							}
						}

						if (isError) {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: errorMsg });
						} else {
							setCurrentPath(tempPath);
						}
					}
					break;
				case 'rm':
					const rmTarget = args[0];
					if (!rmTarget) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'rm: missing operand' });
					} else if (currentDir[rmTarget]) {
						if (currentDir[rmTarget].type === 'DIR') {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `rm: cannot remove '${rmTarget}': Is a directory` });
						} else {
							const newFS = JSON.parse(JSON.stringify(fileSystem));
							let navTarget: any = newFS;
							for (const folder of currentPath) {
								if (navTarget[folder]?.children) navTarget = navTarget[folder].children;
								else if (navTarget.children && navTarget.children[folder]) navTarget = navTarget.children[folder].children;
							}

							if (rmTarget.includes('dolphin')) {
								if (currentPath[currentPath.length - 1] === 'Trap') {
									// They are in the Trap folder, allow deletion
									delete navTarget[rmTarget];
									setFileSystem(newFS);

									// Check if they need to delete more clones!
									const remainingDolphins = Object.keys(navTarget).filter(k => k.includes('dolphin')).length;

									if (remainingDolphins === 0) {
										newHistory.push({ id: Date.now() + 1, type: 'system', text: 'ALL VIRUS INSTANCES DESTROYED. SYSTEM SECURE.' });
										if (onSystemUpdate) onSystemUpdate('rm', 'dolphin_eradicated', currentPath);
									} else {
										newHistory.push({ id: Date.now() + 1, type: 'output', text: `Virus instance deleted. ${remainingDolphins} clone(s) remain in this folder.` });
										if (onSystemUpdate) onSystemUpdate('rm', rmTarget, currentPath);
									}
								} else {
									// Failed to trap it! Duplicate it.
									const copyCount = Object.keys(navTarget).filter(k => k.includes('dolphin')).length;
									navTarget[`dolphin_clone_${copyCount}.exe`] = { type: 'FILE', content: 'HAHAHA YOU CANNOT DEFEAT ME' };
									setFileSystem(newFS);
									newHistory.push({ id: Date.now() + 1, type: 'error', text: 'HAHAHA! YOU CANNOT DESTROY ME HERE! *clones self*' });
								}
							} else {
								delete navTarget[rmTarget];
								setFileSystem(newFS);
								if (onSystemUpdate) onSystemUpdate('rm', rmTarget, currentPath);
							}
						}
					} else {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: `rm: cannot remove '${rmTarget}': No such file or directory` });
					}
					break;
				case 'mkdir':
					const dirName = args[0];
					if (!dirName) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'mkdir: missing operand' });
					} else {
						const newFS = JSON.parse(JSON.stringify(fileSystem));
						let navTarget: any = newFS;
						for (const folder of currentPath) {
							if (navTarget[folder]?.children) navTarget = navTarget[folder].children;
							else if (navTarget.children && navTarget.children[folder]) navTarget = navTarget.children[folder].children;
						}
						if (navTarget[dirName]) {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `mkdir: cannot create directory '${dirName}': File exists` });
						} else {
							navTarget[dirName] = { type: 'DIR', children: {} };
							setFileSystem(newFS);
						}
					}
					break;
				case 'mv':
					const src = args[0];
					const dst = args[1];
					if (!src || !dst) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'mv: missing file operand' });
					} else {
						const newFS = JSON.parse(JSON.stringify(fileSystem));
						let navTarget: any = newFS;
						for (const folder of currentPath) {
							if (navTarget[folder]?.children) navTarget = navTarget[folder].children;
							else if (navTarget.children && navTarget.children[folder]) navTarget = navTarget.children[folder].children;
						}
						if (!navTarget[src]) {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `mv: cannot stat '${src}': No such file` });
						} else if (!navTarget[dst] || navTarget[dst].type !== 'DIR') {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `mv: cannot move to '${dst}': Not a directory` });
						} else {
							if (!navTarget[dst].children) navTarget[dst].children = {};
							navTarget[dst].children[src] = navTarget[src];
							delete navTarget[src];
							setFileSystem(newFS);
							if (onSystemUpdate) onSystemUpdate('mv', src, currentPath);
						}
					}
					break;
				case 'ping':
					const pingTarget = args[0];
					if (!pingTarget) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'ping: missing host operand' });
					} else {
						newHistory.push({ id: Date.now() + 1, type: 'output', text: `Pinging ${pingTarget} with 32 bytes of data:` });
						newHistory.push({ id: Date.now() + 2, type: 'output', text: `Reply from ${pingTarget}: bytes=32 time=14ms TTL=119` });
						newHistory.push({ id: Date.now() + 3, type: 'output', text: `Reply from ${pingTarget}: bytes=32 time=15ms TTL=119` });
						newHistory.push({ id: Date.now() + 4, type: 'output', text: `Reply from ${pingTarget}: bytes=32 time=13ms TTL=119` });
						newHistory.push({ id: Date.now() + 5, type: 'output', text: `Ping statistics for ${pingTarget}:\n    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)` });

						if (onSystemUpdate) onSystemUpdate('ping', pingTarget, currentPath);
					}
					break;
				case 'cat':
					const catTarget = args[0];
					if (!catTarget) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'cat: missing file operand' });
					} else if (currentDir[catTarget]) {
						if (currentDir[catTarget].type === 'DIR') {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `cat: ${catTarget}: Is a directory` });
						} else {
							const lines = currentDir[catTarget].content.split('\n');
							lines.forEach((line: string, i: number) => {
								newHistory.push({ id: Date.now() + i + 1, type: 'output', text: line });
							});
						}
					} else {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: `cat: ${catTarget}: No such file or directory` });
					}
					break;
				case 'grep':
					const searchTerm = args[0];
					const grepFile = args[1];
					if (!searchTerm || !grepFile) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'grep: missing arguments. Usage: grep [word] [file]' });
					} else if (currentDir[grepFile]) {
						if (currentDir[grepFile].type === 'DIR') {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `grep: ${grepFile}: Is a directory` });
						} else {
							const lines = currentDir[grepFile].content.split('\n');
							const matches = lines.filter((line: string) => line.toLowerCase().includes(searchTerm.toLowerCase()));
							if (matches.length > 0) {
								matches.forEach((match: string, i: number) => {
									newHistory.push({ id: Date.now() + i + 1, type: 'output', text: match });
								});
							}
						}
					} else {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: `grep: ${grepFile}: No such file or directory` });
					}
					break;
				case 'login':
					const passwordAttempt = args[0];
					if (!passwordAttempt) {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'login: missing password. Usage: login [password]' });
					} else if (passwordAttempt === 'hackclub_rules') {
						newHistory.push({ id: Date.now() + 1, type: 'system', text: 'Authentication successful. Admin access granted.' });
						if (onSystemUpdate) onSystemUpdate('login', 'success', currentPath);
					} else {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: 'Access denied. Invalid password.' });
					}
					break;
				case 'man':
					const manualTarget = args[0];
					if (!manualTarget) {
						newHistory.push({ id: Date.now() + 1, type: 'output', text: 'What manual page do you want?' });
					} else {
						const manuals: Record<string, string> = {
							'help': 'help - Displays a list of available commands.',
							'clear': 'clear - Clears the terminal screen.',
							'echo': 'echo [text] - Prints text to the terminal.',
							'ls': 'ls - Lists information about the files in the current directory.',
							'cd': 'cd [dir] - Changes the current directory. Use "cd .." to go back.',
							'rm': 'rm [file] - Removes a specified file.',
							'mkdir': 'mkdir [dir] - Creates a new directory.',
							'mv': 'mv [source] [destination] - Moves a file to a destination directory.',
							'ping': 'ping [computer-name] - Sends a small test signal to another computer and waits for a reply to check if it is online and connected.',
							'cat': 'cat [file] - Reads a text file and prints everything inside it to the screen.',
							'grep': 'grep [word] [file] - Searches inside a file and only prints the lines that contain the word you are looking for.',
							'login': 'login [password] - A special system command used to unlock the computer.',
							'man': 'man [command] - Displays the manual for a given command.'
						};
						if (manuals[manualTarget]) {
							newHistory.push({ id: Date.now() + 1, type: 'output', text: manuals[manualTarget] });
						} else {
							newHistory.push({ id: Date.now() + 1, type: 'error', text: `No manual entry for ${manualTarget}` });
						}
					}
					break;
				default:
					newHistory.push({ id: Date.now() + 1, type: 'error', text: `Bad command or file name: "${cmd}"` });
			}

			setHistory(newHistory);
			setInput('');
		}
	};

	return (
		<div className="absolute top-1/4 left-1/4 w-[600px] bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black shadow-[2px_2px_0px_rgba(0,0,0,0.5)] flex flex-col z-10">
			<div className="bg-win-blue text-white flex justify-between items-center px-1 py-1 font-bold tracking-wide">
				<div className="flex items-center gap-2">
					<TerminalIcon size={16} />
					<span className="text-sm">C:\WINDOWS\system32\cmd.exe</span>
				</div>
				<div className="flex gap-1">
					<button className="bg-win-gray text-black border-t-white border-l-white border-b-black border-r-black border-2 px-2 pb-1 text-xs font-bold">_</button>
					<button className="bg-win-gray text-black border-t-white border-l-white border-b-black border-r-black border-2 px-2 pb-1 text-xs font-bold">X</button>
				</div>
			</div>

			<div className="bg-black h-80 p-2 font-mono text-sm overflow-y-auto" onClick={() => document.getElementById('cli-input')?.focus()}>
				{history.map((line) => (
					<div key={line.id} className={`mb-1 ${line.type === 'error' ? 'text-win-hotpink font-bold' : 'text-gray-300'}`}>
						{line.type === 'input' ? line.text : <TypewriterText text={line.text} delay={5} />}
					</div>
				))}

				<div className="flex text-gray-300 mt-1">
					<span className="mr-2">{currentPath.join('\\')}&gt;</span>
					<input
						id="cli-input"
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleCommand}
						className="bg-transparent border-none outline-none text-gray-300 flex-1 caret-gray-300"
						autoFocus autoComplete="off" spellCheck="false"
					/>
				</div>
				<div ref={bottomRef} />
			</div>
		</div>
	);
}