(function (global) {
    function xorEncryptDecrypt(input, key) {
        let output = '';

        if (!key) {
            key = ''
        }

        for (let i = 0; i < input.length; i++) {
            output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }

        return output;
    }

    function base64Encode(str) {
        if (typeof Buffer !== 'undefined') {
            // Siamo in Node.js
            return Buffer.from(str, 'binary').toString('base64');
        } else if (typeof btoa !== 'undefined') {
            // Siamo nel browser
            return btoa(unescape(encodeURIComponent(str)));
        } else {
            throw new Error('Ambiente non supportato per base64Encode');
        }
    }

    // Funzione per decodificare da base64
    function base64Decode(str) {
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(str, 'base64').toString('binary');
        } else if (typeof atob !== 'undefined') {
            console.log('atob', str)
            return decodeURIComponent(escape(atob(str)));
        } else {
            throw new Error('Ambiente non supportato per base64Decode');
        }
    }

    function jsonCryptFetch(url, key) {
        const encryptedFile = getEncryptedFile(url);

        return fetch(encryptedFile).then(async response => {
            const data = await response.text()
            const decryptedData = xorEncryptDecrypt(base64Decode(data), key);
            console.log("decryptedData", decryptedData)
            const json = JSON.parse(decryptedData)

            if (typeof json === 'object') {
                return json
            }
        })
    }

    function usage() {
        console.error('Usage: node jsoncrypt.js [encrypt|decrypt] <file> <key>');
        process.exit(1);
    }

    if (typeof module !== 'undefined' && module.exports) {
        var fs = require('fs');

        if (require.main === module) {
            // Node.js as entry point
            var args = process.argv.slice(2);

            if (args.length < 2) {
                usage();
            }

            var command = args[0];
            var file = args[1];
            var key = args[2];

            if (["encrypt", "decrypt"].indexOf(command) === -1) {
                usage();
            }

            if (!fs.existsSync(file)) {
                console.error('File not found:', file);
                process.exit(1);
            }

            var data = fs.readFileSync(file, 'utf8');
            if (command === 'encrypt') {
                console.log(base64Encode(xorEncryptDecrypt(data, key)));
            } else {
                console.log(xorEncryptDecrypt(base64Decode(data), key));
            }
        } else {
            // Node.js as module
            module.exports = cryptFetch;
        }
    } else {
        // Browser
        global.cryptFetch = cryptFetch;
    }
})(typeof window !== 'undefined' ? window : global);
