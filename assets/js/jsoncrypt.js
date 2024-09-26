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
        return Buffer.from(str, 'binary').toString('base64');
    }

    function base64Decode(str) {
        return Buffer.from(str, 'base64').toString('binary');
    }

    function getEncryptedFile(file) {
        if (file.endsWith('.enc.json')) {
            return file;
        } else if (file.endsWith('.dec.json')) {
            return file.replace('.dec.json', '.enc.json');
        }

        return file.replace('.json', '.enc.json');
    }

    function getDecryptedFile(file) {
        if (file.endsWith('.dec.json')) {
            return file;
        } else if (file.endsWith('.enc.json')) {
            return file.replace('.enc.json', '.dec.json');
        }

        return file.replace('.json', '.dec.json');
    }

    function jsonCryptFetch(url, key) {
        const encryptedFile = getEncryptedFile(url);

        return fetch(encryptedFile).then(response => {
            const data = response.text()
            console.log("data", data)
            return data
        })
    }

    function usage() {
        console.error('Usage: node jsoncrypt.js [encrypt|decrypt] <file>');
        process.exit(1);
    }

    if (typeof module !== 'undefined' && module.exports) {
        var fs = require('fs');
        var jsoncrypt = JSON.parse(fs.readFileSync('jsoncrypt.json', 'utf8'));

        if (require.main === module) {
            // Node.js as entry point

            var args = process.argv.slice(2);

            if (args.length < 2) {
                usage();
            }

            var command = args[0];
            var file = args[1];
            var encryptedFile = file.replace('.dec.json', '.enc.json');
            var decryptedFile = file.replace('.enc.json', '.dec.json');
            var key = '';
            if (command === 'encrypt') {
                if (!fs.existsSync(decryptedFile)) {
                    console.error('File not found:', decryptedFile);
                    process.exit(1);
                }
                for (let index in jsoncrypt['files']) {
                    if (!fs.existsSync(index)) {
                        continue
                    }
                    if (fs.realpathSync(decryptedFile) === fs.realpathSync(index)) {
                        key = jsoncrypt['files'][index];
                    }
                }

                var json = fs.readFileSync(decryptedFile, 'utf8');
                var encyptedJson = xorEncryptDecrypt(json, key);
                fs.writeFileSync(encryptedFile, base64Encode(encyptedJson));
            } else if (command !== 'decrypt') {

            } else {
                usage()
            }


        } else {
            // Node.js as module
            module.exports = myFunction;
        }
    } else {
        // Browser
        global.jsonCryptFetch = jsonCryptFetch;
    }
})(typeof window !== 'undefined' ? window : global);
