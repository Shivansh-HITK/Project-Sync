import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api'; // Use your local IP for real device
  final _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _storage.write(key: 'token', value: data['token']);
      await _storage.write(key: 'user', value: jsonEncode(data['user']));
      return data;
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Login failed');
    }
  }

  Future<Map<String, dynamic>> initiatePairing(String deviceName) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('$baseUrl/pairing/initiate'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'deviceName': deviceName}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to initiate pairing');
    }
  }

  Future<void> completePairing(String pairingToken, String deviceName) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('$baseUrl/pairing/complete'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'token': pairingToken, 'deviceName': deviceName}),
    );

    if (response.statusCode != 200) {
      throw Exception('Pairing failed');
    }
  }
}
