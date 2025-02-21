import express from 'express';
import QRCodeController from '../controllers';
import { protect } from '@guard/restrictTo';

const qrRouter = express.Router();

qrRouter.use(protect)
// Create QR Code
qrRouter.post('/', QRCodeController.createQr);

// Update QR Code Style
qrRouter.patch('/:qrId/style', QRCodeController.updateQRCodeStyle);

// Track QR Code Scan
qrRouter.post('/:qrId/track', QRCodeController.trackScan);

// Delete QR Code
qrRouter.delete('/:qrId', QRCodeController.deleteQRCode);

export default qrRouter;
