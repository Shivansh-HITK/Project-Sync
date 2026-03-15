import 'dart:convert';
import 'package:encrypt/encrypt.dart';

class CryptoUtils {
  static String encrypt(String text, String keyStr) {
    final key = Key.fromBase64(keyStr);
    final iv = IV.fromLength(16);
    final encrypter = Encrypter(AES(key));

    final encrypted = encrypter.encrypt(text, iv: iv);
    return "${base64.encode(iv.bytes)}:${encrypted.base64}";
  }

  static String decrypt(String encryptedText, String keyStr) {
    final key = Key.fromBase64(keyStr);
    final parts = encryptedText.split(':');
    final iv = IV.fromBase64(parts[0]);
    final encrypter = Encrypter(AES(key));

    return encrypter.decrypt(Encrypted.fromBase64(parts[1]), iv: iv);
  }
}
