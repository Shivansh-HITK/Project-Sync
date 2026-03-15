class P2PService {
  constructor(socket, fromDeviceId) {
    this.socket = socket;
    this.fromDeviceId = fromDeviceId;
    this.peerConnection = null;
    this.dataChannel = null;
    this.userId = null;
  }

  init(userId) {
    this.userId = userId;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('signal', {
          targetUserId: this.userId,
          signalData: { ice: event.candidate },
          fromDeviceId: this.fromDeviceId
        });
      }
    };

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };
  }

  async createOffer() {
    this.dataChannel = this.peerConnection.createDataChannel('fileTransfer');
    this.setupDataChannel();

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socket.emit('signal', {
      targetUserId: this.userId,
      signalData: { sdp: offer },
      fromDeviceId: this.fromDeviceId
    });
  }

  async handleSignal(signalData) {
    if (signalData.sdp) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signalData.sdp));
      if (signalData.sdp.type === 'offer') {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.socket.emit('signal', {
          targetUserId: this.userId,
          signalData: { sdp: answer },
          fromDeviceId: this.fromDeviceId
        });
      }
    } else if (signalData.ice) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(signalData.ice));
    }
  }

  setupDataChannel() {
    this.dataChannel.onopen = () => console.log('P2P Data Channel Open');
    this.dataChannel.onmessage = (event) => {
      console.log('P2P Message Received:', event.data);
      // Handle file chunk reception
    };
  }

  sendFile(fileBuffer) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(fileBuffer);
    }
  }
}

module.exports = P2PService;
