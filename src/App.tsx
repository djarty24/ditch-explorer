import { useState } from 'react';
import { Folder } from 'lucide-react';
import Terminal from './components/Terminal';
import ErrorModal from './components/ErrorModal';

export default function App() {
	const [isSystemCrashed, setIsSystemCrashed] = useState(true);

	const handleAcknowledgeError = () => {
		setIsSystemCrashed(false);
	};

	return (
		<div className="h-screen w-screen flex flex-col scanlines">

			{isSystemCrashed && <ErrorModal onAcknowledge={handleAcknowledgeError} />}

			<div className="flex-1 relative p-4">
				<div className="flex flex-col items-center w-20 gap-1 text-white cursor-pointer hover:bg-win-hotpink/30 p-1 rounded">
					<Folder size={40} className="fill-yellow-400 text-yellow-600" />
					<span className="bg-win-blue px-1 text-sm shadow-sm">My System</span>
				</div>

				<Terminal />
			</div>

			<div className="h-10 bg-win-gray border-t-2 border-white shadow-[0_-1px_2px_rgba(0,0,0,0.2)]"></div>
		</div>
	);
}