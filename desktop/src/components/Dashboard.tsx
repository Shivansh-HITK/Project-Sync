import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Clipboard, Image as ImageIcon, File, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../services/socket';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [clipboardText, setClipboardText] = useState('');
  const [receivedItems, setReceivedItems] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for clipboard changes from Electron main process
    if ((window as any).electronAPI) {
      (window as any).electronAPI.onClipboardChanged((text: string) => {
        setClipboardText(text);
        if (user.id) {
          socketService.sendClipboard(user.id, text, 'desktop-1');
        }
      });
    }

    // Connect socket if not connected
    if (user.id) {
      socketService.connect(user.id);
    }
  }, [user.id]);

  const handleLogout = () => {
    localStorage.clear();
    socketService.disconnect();
    navigate('/login');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    // TODO: Initiate P2P or Server-Relay transfer
  };

  const captureScreenshot = async () => {
    if ((window as any).electronAPI) {
      const dataUrl = await (window as any).electronAPI.captureScreen();
      console.log('Captured screenshot');
      if (user.id) {
        socketService.sendScreenshot(user.id, dataUrl, 'desktop-1');
      }
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">PS</div>
            <span className="font-bold text-xl tracking-tight">Project Sync</span>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-xl text-blue-400 font-medium">
              <Laptop className="w-5 h-5" />
              Devices
            </button>
            <button onClick={() => navigate('/pairing')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
              <Smartphone className="w-5 h-5" />
              Pair New
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
              <ImageIcon className="w-5 h-5" />
              Gallery
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-medium">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-zinc-500">Pro Plan</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md">
          <h2 className="text-xl font-semibold">Main Desktop</h2>
          <div className="flex gap-4">
            <button onClick={captureScreenshot} className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black transition-all rounded-lg text-sm font-medium">
              Take Screenshot
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Drop Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all
              ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}
            `}
          >
            <div className="p-4 bg-zinc-800 rounded-2xl mb-4">
              <File className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-zinc-500'}`} />
            </div>
            <p className="text-lg font-medium">Drag & Drop files to send</p>
            <p className="text-sm text-zinc-500 mt-1">Files will be instantly synced to paired devices</p>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-6">Recent Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receivedItems.length === 0 ? (
                <div className="col-span-full py-20 text-center text-zinc-600 border border-zinc-800 border-dashed rounded-2xl italic">
                  No recent activities to show.
                </div>
              ) : (
                receivedItems.map((item, idx) => (
                  <div key={idx} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    {/* Item Card Content */}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
