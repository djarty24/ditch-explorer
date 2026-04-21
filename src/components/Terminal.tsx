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
			'System': {
				type: 'DIR',
				children: {
					'Boot': {
						type: 'DIR',
						children: {
							'corrupted_file.sys': { type: 'FILE', content: '0xDEADBEEF FATAL CORRUPTION' }
						}
					}
				}
			},
			'Downloads': {
				type: 'DIR',
				children: {
					'display.dll': { type: 'FILE', content: 'BINARY_DRIVER_DATA' }
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

export default function Terminal() {
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
					newHistory.push({ id: Date.now() + 1, type: 'output', text: 'Available commands: help, clear, echo, ls, cd' });
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
					} else if (target === '..') {
						if (currentPath.length > 1) {
							setCurrentPath(prev => prev.slice(0, -1));
						}
					} else if (currentDir[target] && currentDir[target].type === 'DIR') {
						setCurrentPath(prev => [...prev, target]);
					} else if (currentDir[target] && currentDir[target].type === 'FILE') {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: `cd: ${target}: Not a directory` });
					} else {
						newHistory.push({ id: Date.now() + 1, type: 'error', text: `cd: ${target}: No such file or directory` });
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