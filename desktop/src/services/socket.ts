import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      this.socket?.emit('join', userId);
    });

    this.socket.on('clipboard-sync', (data: { text: string }) => {
      console.log('Received clipboard sync:', data.text);
      if ((window as any).electronAPI) {
        (window as any).electronAPI.writeClipboard(data.text);
      }
    });

    this.socket.on('signal', (data: any) => {
      // Handle WebRTC signaling
      console.log('Received WebRTC signal:', data);
    });
  }

  sendClipboard(userId: string, text: string, fromDeviceId: string) {
    this.socket?.emit('clipboard-sync', { userId, text, fromDeviceId });
  }

  sendScreenshot(userId: string, imageUrl: string, fromDeviceId: string) {
    this.socket?.emit('screenshot-sync', { userId, imageUrl, fromDeviceId });
  }

  sendSignal(userId: string, signalData: any, fromDeviceId: string) {
    this.socket?.emit('signal', { targetUserId: userId, signalData, fromDeviceId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
