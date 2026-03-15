import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class SocketService with ChangeNotifier {
  IO.Socket? socket;
  final _storage = const FlutterSecureStorage();

  bool _isConnected = false;
  bool get isConnected => _isConnected;

  void connect() async {
    final userJson = await _storage.read(key: 'user');
    if (userJson == null) return;
    
    final user = jsonDecode(userJson);
    final userId = user['id'];

    socket = IO.io('http://localhost:5000', 
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .disableAutoConnect()
        .build()
    );

    socket!.connect();

    socket!.onConnect((_) {
      _isConnected = true;
      socket!.emit('join', userId);
      notifyListeners();
    });

    socket!.onDisconnect((_) {
      _isConnected = false;
      notifyListeners();
    });

    socket!.on('clipboard-sync', (data) {
      // Handle clipboard sync from other devices
      print('Clipboard received: ${data['text']}');
      // TODO: Native clipboard write
    });

    socket!.on('signal', (data) {
      // Handle WebRTC signaling
    });
  }

  void sendClipboard(String userId, String text, String fromDeviceId) {
    socket?.emit('clipboard-sync', {
      'userId': userId,
      'text': text,
      'fromDeviceId': fromDeviceId,
    });
  }

  void sendSignal(String targetUserId, Map<String, dynamic> signalData, String fromDeviceId) {
    socket?.emit('signal', {
      'targetUserId': targetUserId,
      'signalData': signalData,
      'fromDeviceId': fromDeviceId,
    });
  }

  void onSignal(Function(Map<String, dynamic>) callback) {
    socket?.on('signal', (data) => callback(data as Map<String, dynamic>));
  }

  void disconnect() {
    socket?.disconnect();
    _isConnected = false;
    notifyListeners();
  }
}
