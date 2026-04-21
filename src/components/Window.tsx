import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface WindowProps {
  title: string;
  content: string;
  hints?: string[]; // Make hints optional so we can use this window for other things later
  onClose: () => void;
}

export default function Window({ title, content, hints, onClose }: WindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Track which hint dropdowns are currently open
  const [openHints, setOpenHints] = useState<number[]>([]);

  const toggleHint = (index: number) => {
    if (openHints.includes(index)) {
      setOpenHints(openHints.filter((i) => i !== index));
    } else {
      setOpenHints([...openHints, index]);
    }
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".window-handle" bounds="parent">
      <div ref={nodeRef} className="absolute top-10 left-10 w-96 bg-win-gray border-t-2 border-l-2 border-white border-b-black border-r-black shadow-[2px_2px_0px_rgba(0,0,0,0.5)] flex flex-col z-40">
        
        {/* Title Bar */}
        <div className="window-handle bg-win-blue text-white flex justify-between items-center px-1 py-1 font-bold tracking-wide cursor-move">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span className="text-sm">{title}</span>
          </div>
          <button 
            onClick={onClose} 
            className="bg-win-gray text-black border-t-white border-l-white border-b-black border-r-black border-2 px-2 pb-1 text-xs font-bold cursor-default active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
          >
            X
          </button>
        </div>

        {/* Window Content */}
        <div className="bg-white p-2 m-[2px] min-h-[16rem] max-h-96 overflow-y-auto font-mono text-sm border-t-black border-l-black border-b-white border-r-white border-2 text-black flex flex-col gap-4">
          <p className="whitespace-pre-wrap">{content}</p>

          {/* Render Hints Section if hints exist */}
          {hints && hints.length > 0 && (
            <div className="mt-4 border-t-2 border-dashed border-gray-300 pt-2 flex flex-col gap-2">
              <p className="font-bold text-gray-500">-- TROUBLESHOOTING --</p>
              
              {hints.map((hint, index) => (
                <div key={index} className="border border-gray-300 bg-gray-50">
                  <button 
                    onClick={() => toggleHint(index)}
                    className="w-full flex items-center gap-1 p-1 font-bold text-win-blue hover:bg-gray-200 text-left"
                  >
                    {openHints.includes(index) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    Hint {index + 1}
                  </button>
                  
                  {openHints.includes(index) && (
                    <div className="p-2 border-t border-gray-300 whitespace-pre-wrap text-gray-700">
                      {hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Draggable>
  );
}