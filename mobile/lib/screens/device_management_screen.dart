import 'package:flutter/material.dart';

class DeviceManagementScreen extends StatelessWidget {
  const DeviceManagementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock device list
    final devices = [
      {'name': 'Main Desktop', 'type': 'desktop', 'status': 'Online'},
      {'name': 'Work Laptop', 'type': 'desktop', 'status': 'Offline'},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Managed Devices')),
      body: ListView.builder(
        itemCount: devices.length,
        itemBuilder: (context, index) {
          final device = devices[index];
          return ListTile(
            leading: Icon(
              device['type'] == 'desktop' ? Icons.laptop : Icons.smartphone,
              color: device['status'] == 'Online' ? Colors.green : Colors.grey,
            ),
            title: Text(device['name']!),
            subtitle: Text('Status: ${device['status']}'),
            trailing: IconButton(
              icon: const Icon(Icons.remove_circle_outline, color: Colors.red),
              onPressed: () {
                // TODO: Remove device logic
              },
            ),
          );
        },
      ),
    );
  }
}
