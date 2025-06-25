/*
Monnify API wrapper
@authors: Tochukwu Nwokolo & Benjamin Ononogbu & Emmanuel Elom
*/

import axios from 'axios';
import crypto from 'crypto';
import promises from 'fs';

const TOKENEXPIRATIONTHRESHOLD = process.env.TOKENEXPIRATIONTHRESHOLD || 500
const TOKENFILE = process.env.TOKENFILE || 'Cache'

let singletonInstance: MonnifyAPI

export default class MonnifyAPI {
    headers!: { "Content-Type": string; Authorization: string; };
    environment!: string;
    baseUrl!: string;
    apiKey: string | undefined;
    secretKey: string | undefined;
    isTokenSet!: boolean;
    expiryTime!: number;
    cacheFile!: string;

    constructor(config: {
        MONNIFY_APIKEY: string,
        MONNIFY_SECRET: string,
        env: string,
    }) {
        const environment = `${config.env}`.toUpperCase()
        if (singletonInstance) {
            if (singletonInstance.environment !== environment) {
                throw new Error('You cannot instantiate multiple environment at one runtime')
            }
            return singletonInstance
        }
        this.headers = {
            "Content-Type": "application/json",
            "Authorization": ""
        }

        this.environment = environment
        if (this.environment === 'SANDBOX') {
            this.baseUrl = "https://sandbox.monnify.com";
            this.cacheFile = `SANDBOX_${TOKENFILE}.js`
        } else if (this.environment === 'LIVE') {
            this.baseUrl = "https://api.monnify.com";
            this.cacheFile = `LIVE_${TOKENFILE}.js`
        } else {
            throw new Error("Unknown environment passed: " + config.env + ". Specify between SANDBOX and LIVE");
        }

        this.apiKey = config.MONNIFY_APIKEY;
        this.secretKey = config.MONNIFY_SECRET;
        this.isTokenSet = false
        this.expiryTime = 0
        singletonInstance = this
    }

    async getToken(cached = true) {
        if (this.isTokenSet && (this.expiryTime > Math.floor(Date.now() / 1000))) {
            const token = await this.getCachedToken()
            return [200, token]
        }

        const url = this.baseUrl + '/api/v1/auth/login';
        const data = {};
        this.headers.Authorization = `Basic ${Buffer.from(this.apiKey + ":" + this.secretKey).toString('base64')}`;

        try {
            const response = await axios.post(url, data, { 'headers': this.headers });
            if (cached && (response.data.responseBody.expiresIn >= TOKENEXPIRATIONTHRESHOLD)) {
                await this.setToken(response.data.responseBody.accessToken,
                    response.data.responseBody.expiresIn + Math.floor(Date.now() / 1000)
                )
            }
            return [response.status, response.data.responseBody.accessToken];
        } catch (e: any) {
            console.log(e)
            return [e.response.status, e.response.data]
        }
    }

    async setToken(tokenObject: string | NodeJS.ArrayBufferView<ArrayBufferLike>, timeStamp: number) {
        try {
            const handler = promises.writeFileSync(this.cacheFile, tokenObject);
            this.isTokenSet = true
            this.expiryTime = timeStamp
        } catch (e) {
            console.log(e)
        }
    }

    async getCachedToken() {
        return promises.readFileSync(this.cacheFile, { encoding: 'utf8' });
    }

    async get(url_path: string, authorization: any) {

        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try {
            const response = await axios.get(url, { 'headers': this.headers });
            return [response.status, response.data];
        } catch (e: any) {
            return [e.response.status, e.response.data]
        }
    }

    async post(url_path: string, authorization: any, data: any) {
        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try {
            const response = await axios.post(url, data, { 'headers': this.headers });
            return [response.status, response.data];
        } catch (e: any) {
            return [e.response.status, e.response.data]
        }
    }

    async put(url_path: string, authorization: any, data: any) {
        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try {
            const response = await axios.put(url, data, { 'headers': this.headers });
            return [response.status, response.data];
        } catch (e: any) {
            return [e.response.status, e.response.data]
        }
    }

    async delete(url_path: string, authorization: any) {
        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try {
            const response = await axios.delete(url, { 'headers': this.headers });
            return [response.status, response.data];
        } catch (e: any) {
            return [e.response.status, e.response.data]
        }
    }

    async computeTransactionHash(payload: any, signature: string) {
        try {
            const hmac = crypto.createHmac('sha512', this.secretKey as string);
            const hash = hmac.update(JSON.stringify(payload));
            const hash_in_hex = hash.digest('hex');
            return signature === hash_in_hex;
        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    
}

