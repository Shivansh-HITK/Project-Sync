import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class FileUploadScreen extends StatefulWidget {
  const FileUploadScreen({super.key});

  @override
  State<FileUploadScreen> createState() => _FileUploadScreenState();
}

class _FileUploadScreenState extends State<FileUploadScreen> {
  List<PlatformFile>? _files;

  void _pickFiles() async {
    final result = await FilePicker.platform.pickFiles(allowMultiple: true);
    if (result != null) {
      setState(() => _files = result.files);
    }
  }

  void _uploadFiles() {
    if (_files == null) return;
    // TODO: Implement P2P or Server sync for each file
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Starting synchronization...')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Send Files')),
      body: Column(
        children: [
          Expanded(
            child: _files == null 
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.cloud_upload_outlined, size: 100, color: Colors.blueGrey),
                      const SizedBox(height: 16),
                      const Text('No files selected', style: TextStyle(fontSize: 18)),
                      ElevatedButton(
                        onPressed: _pickFiles,
                        child: const Text('Select Files'),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  itemCount: _files!.length,
                  itemBuilder: (context, index) {
                    final file = _files![index];
                    return ListTile(
                      leading: const Icon(Icons.file_present),
                      title: Text(file.name),
                      subtitle: Text('${(file.size / 1024).toStringAsFixed(2)} KB'),
                      trailing: IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => setState(() => _files!.removeAt(index)),
                      ),
                    );
                  },
                ),
          ),
          if (_files != null && _files!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: ElevatedButton(
                onPressed: _uploadFiles,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(56),
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Sync to Devices', style: TextStyle(fontSize: 18)),
              ),
            ),
        ],
      ),
    );
  }
}
