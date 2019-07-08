import https from 'https';
import fs from 'fs';

export async function downloadHttps(url: string, dest: string,) {
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        const request = https.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                resolve();
            });
        }).on('error', function (err) { // Handle errors
            fs.unlinkSync(dest);
            reject(err);
        });
    });

};