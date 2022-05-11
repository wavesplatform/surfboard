import https from 'https';
import fs from 'fs';
import { cli } from 'cli-ux';
import * as path from "path";
import configService from './services/config';

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
}

export function parseVariables(variablesStr: string) {
    const ERROR_MSG = 'Invalid variables flag value. Should be {key}={value}. E.g.: ADDRESS="AX5FF Foo",AMOUNT=1000';
    console.log(variablesStr)
    return variablesStr.split(',').reduce((acc, keyValue) => {
        const splitted = keyValue.split('=');
        if (splitted.length !== 2 || splitted[0].length === 0 || splitted[1].length === 0) cli.error(ERROR_MSG);
        const key = splitted[0];
        if (typeof splitted[1] !== 'string' ) cli.error(ERROR_MSG);
        return {...acc, [key]: splitted[1]};
    }, {} as Record<string, string>);
}

export function getFileContent(fileNameOrPath: string) {
    const pathIfFileName = path.join(process.cwd(), configService.config.get('ride_directory'), fileNameOrPath);
    const pathIfPath = path.resolve(process.cwd(), fileNameOrPath);

    if (fs.existsSync(pathIfPath)) {
        return fs.readFileSync(pathIfPath, 'utf-8');
    } else if (fs.existsSync(pathIfFileName)) {
        return fs.readFileSync(pathIfFileName, 'utf8');
    }

    throw new Error(`File "${fileNameOrPath}" not found`);
};

export function getLibContent(filePath: string, libPath: string) {
    const fileNameOrPath = path.normalize(filePath+'/../'+libPath)
    return getFileContent(fileNameOrPath)
};
