import { Request, Response } from 'express';
import crypto from 'crypto';
import Pairing from '../models/Pairing';
import Device from '../models/Device';

export const initiatePairing = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { deviceName } = req.body;

    // Registar or find the desktop device
    let device = await Device.findOne({ userId, deviceName, deviceType: 'desktop' });
    if (!device) {
      device = new Device({ userId, deviceName, deviceType: 'desktop', isPaired: true });
      await device.save();
    }

    const token = crypto.randomBytes(32).toString('hex');
    const pairing = new Pairing({
      token,
      userId,
      desktopDeviceId: device._id,
      status: 'pending'
    });

    await pairing.save();

    res.json({ token, pairingId: pairing._id });
  } catch (err: any) {
    res.status(500).json({ message: 'Error initiating pairing', error: err.message });
  }
};

export const completePairing = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { token, deviceName } = req.body;

    const pairing = await Pairing.findOne({ token, userId, status: 'pending' });
    if (!pairing) {
      return res.status(400).json({ message: 'Invalid or expired pairing token' });
    }

    // Register the mobile device
    const mobileDevice = new Device({
      userId,
      deviceName,
      deviceType: 'mobile',
      isPaired: true
    });
    await mobileDevice.save();

    pairing.status = 'completed';
    await pairing.save();

    res.json({ message: 'Pairing successful', deviceId: mobileDevice._id });
  } catch (err: any) {
    res.status(500).json({ message: 'Error completing pairing', error: err.message });
  }
};
