import 'package:flutter_webrtc/flutter_webrtc.dart';
import '../services/socket_service.dart';

class WebRTCService {
  RTCPeerConnection? _peerConnection;
  RTCDataChannel? _dataChannel;
  final SocketService socketService;
  final String userId;
  final String fromDeviceId;

  WebRTCService({required this.socketService, required this.userId, required this.fromDeviceId});

  Future<void> init() async {
    _peerConnection = await createPeerConnection({
      'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
    });

    _peerConnection!.onIceCandidate = (candidate) {
      socketService.sendSignal(userId, {'ice': candidate.toMap()}, fromDeviceId);
    };

    _peerConnection!.onDataChannel = (channel) {
      _dataChannel = channel;
      _setupDataChannel();
    };
  }

  Future<void> createOffer() async {
    RTCDataChannelInit init = RTCDataChannelInit();
    _dataChannel = await _peerConnection!.createDataChannel('fileTransfer', init);
    _setupDataChannel();

    RTCSessionDescription offer = await _peerConnection!.createOffer();
    await _peerConnection!.setLocalDescription(offer);

    socketService.sendSignal(userId, {'sdp': offer.toMap()}, fromDeviceId);
  }

  Future<void> handleSignal(Map<String, dynamic> signalData) async {
    if (signalData.containsKey('sdp')) {
      var description = RTCSessionDescription(signalData['sdp']['sdp'], signalData['sdp']['type']);
      await _peerConnection!.setRemoteDescription(description);
      
      if (description.type == 'offer') {
        RTCSessionDescription answer = await _peerConnection!.createAnswer();
        await _peerConnection!.setLocalDescription(answer);
        socketService.sendSignal(userId, {'sdp': answer.toMap()}, fromDeviceId);
      }
    } else if (signalData.containsKey('ice')) {
      var candidate = RTCIceCandidate(
        signalData['ice']['candidate'],
        signalData['ice']['sdpMid'],
        signalData['ice']['sdpMLineIndex'],
      );
      await _peerConnection!.addIceCandidate(candidate);
    }
  }

  void _setupDataChannel() {
    _dataChannel!.onDataChannelState = (state) {
      print('Data Channel State: $state');
    };
    _dataChannel!.onMessage = (message) {
      print('Received P2P message');
      // Handle file chunk
    };
  }

  void sendFile(dynamic data) {
    if (_dataChannel != null && _dataChannel!.state == RTCDataChannelState.RTCDataChannelOpen) {
      _dataChannel!.send(RTCDataChannelMessage(data));
    }
  }
}
