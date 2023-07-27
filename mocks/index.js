#!/usr/bin/env node

const http = require('http');
const path = require('path');

const dotenv = require('dotenv');

const mockserver = require('./mock-server');

dotenv.config();

const HTTP_HOST = process.env.HTTP_HOST || 'localhost';
const HTTP_PORT = process.env.HTTP_PORT || 8080;

class Mock {
    constructor(host, port, verbose = true) {
        const mockDir = path.join(__dirname, 'api');
        const version = '1';
        http.createServer(mockserver(mockDir, verbose)).listen(port, (error) => {
            if (error) {
                console.log(`Mock server ${version} unhandled exception`, error);
                return;
            }

            if (verbose) {
                const url = `http://${host}:${port}`;
                console.log(`Mockserver serving mock api on: ${url}`);
            }
        });
    }
}

new Mock(HTTP_HOST, HTTP_PORT, true);
