# Library Barcode Tool

This tool allows you to quickly add or update item barcodes in the Alma library catalog using API's.  You search for items by call number.

## Motivation

This project was undertaken because a large portion of our collections do not have physical barcodes on them, but instead have auto-generated codes from heritage library catalog systems.  Barcodes are an entry point for many of our workflows and clean up projects, but manually adding them to each item in the catalog involved too many clicks and time. This tool makes it much more efficient to add barcodes to lots of items quickly.  

## Code Style

This app is written in JavaScript. Corsproxy is used 

## How to use

This APP requires an API key that has Primo read access and Alma Bibs read/write access.

To use this app you need to add the API key for your institution here:
`library-barcode-tool> application> static> js> barcode.js`


## Credits
Mark Luker wrote the JavaScript code,
Sara Gates got the app to work in a container,
Laura Rodriguez mapped the API calls and wrote documentation

## License