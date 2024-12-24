import { NativeModules, NativeEventEmitter } from "react-native"

export interface ScannerEvent {
  data: string
}

interface HoneywellScannerNativeModule {
  isCompatible?: boolean
  version: string
  BARCODE_READ_SUCCESS: string
  BARCODE_READ_FAIL: string
  startReader: () => Promise<boolean>
  stopReader: () => Promise<void>
}

interface ScannerInitialized extends HoneywellScannerNativeModule {
  isPresent: true
  onBarcodeReadSuccess: (handler: (event: ScannerEvent) => void) => void
  offBarcodeReadSuccess: () => void
  onBarcodeReadFail: (handler: () => void) => void
  offBarcodeReadFail: () => void
}

interface ScannerUninitialized {
  isPresent: false
  isCompatible: false
}

function createHoneywellScanner(): ScannerInitialized | ScannerUninitialized {
  const { HoneywellScanner } = NativeModules as {
    HoneywellScanner: HoneywellScannerNativeModule
  }

  if (HoneywellScanner) {
    /**
     * Listen for available events
     * @param  {String} eventName Name of event one of barcodeReadSuccess, barcodeReadFail
     * @param  {Function} handler Event handler
     */

    const barcodeReaderEmitter = new NativeEventEmitter(HoneywellScanner)

    var subscriptionBarcodeReadSuccess = null
    var subscriptionBarcodeReadFail = null

    const onBarcodeReadSuccess = (handler: (event: ScannerEvent) => void) => {
      subscriptionBarcodeReadSuccess?.remove()
      subscriptionBarcodeReadSuccess = null
      subscriptionBarcodeReadSuccess = barcodeReaderEmitter.addListener(
        HoneywellScanner.BARCODE_READ_SUCCESS,
        handler
      )
    }

    const onBarcodeReadFail = (handler: () => void) => {
      subscriptionBarcodeReadFail?.remove()
      subscriptionBarcodeReadFail = null
      subscriptionBarcodeReadFail = barcodeReaderEmitter.addListener(
        HoneywellScanner.BARCODE_READ_FAIL,
        handler
      )
    }

    /**
     * Stop listening for event
     * @param  {String} eventName Name of event one of barcodeReadSuccess, barcodeReadFail
     * @param  {Function} handler Event handler
     */
    const offBarcodeReadSuccess = () => {
      subscriptionBarcodeReadSuccess?.remove()
    }
    const offBarcodeReadFail = () => {
      subscriptionBarcodeReadFail?.remove()
    }

    return {
      isPresent: true,
      ...HoneywellScanner,
      onBarcodeReadSuccess,
      offBarcodeReadSuccess,
      onBarcodeReadFail,
      offBarcodeReadFail,
    }
  } else {
    return {
      isPresent: false,
      isCompatible: false,
    }
  }
}

export default createHoneywellScanner()
