# react-native-honeywell-scanner

This module is fork of [react-native-honeywell-scanner-v2](https://github.com/AMI3GOLtd/react-native-honeywell-scanner).
It is fixing situation when scanner is not present in the device.

## Getting started

`$ npm install react-native-honeywell-scanner-v2 --save`

## Usage

```javascript
import HoneywellScanner from 'react-native-honeywell-scanner-v2';

...

useEffect(() => {
        if( HoneywellScanner.isCompatible ) {
            HoneywellScanner.startReader().then((claimed) => {
                console.log(claimed ? 'Barcode reader is claimed' : 'Barcode reader is busy');
                HoneywellScanner.onBarcodeReadSuccess(event => {
                    console.log('Received data', event.data);
                });

            });


            return(
                () => {
                    HoneywellScanner.stopReader().then(() => {
                        console.log("Freedom!!");
                        HoneywellScanner.offBarcodeReadSuccess();
                    });
                }
            )
        }
    }, []);
```
