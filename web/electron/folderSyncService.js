const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class FolderSyncService {
  constructor(socket, userId, fromDeviceId) {
    this.socket = socket;
    this.userId = userId;
    this.fromDeviceId = fromDeviceId;
    this.watchers = new Map();
  }

  watchFolder(folderPath) {
    if (this.watchers.has(folderPath)) return;

    const watcher = chokidar.watch(folderPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher
      .on('add', filePath => this.syncFile(filePath, 'add'))
      .on('change', filePath => this.syncFile(filePath, 'change'))
      .on('unlink', filePath => this.syncFile(filePath, 'unlink'));

    this.watchers.set(folderPath, watcher);
    console.log(`Watching folder: ${folderPath}`);
  }

  syncFile(filePath, action) {
    const fileName = path.basename(filePath);
    console.log(`File ${action}: ${fileName}`);
    
    // In a real app, you'd read the file and send it via P2P or Upload to S3
    // For now, we'll just emit a metadata event
    this.socket.emit('file-sync', {
      userId: this.userId,
      fileName,
      action,
      fromDeviceId: this.fromDeviceId,
      timestamp: Date.now()
    });
  }

  stopWatching(folderPath) {
    const watcher = this.watchers.get(folderPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(folderPath);
    }
  }
}

module.exports = FolderSyncService;
