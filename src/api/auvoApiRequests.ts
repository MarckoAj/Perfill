import fetch, { BodyInit, HeadersInit, Response } from 'node-fetch';
import dotenv from 'dotenv';
import urlsRep from '../repositores/urlsRep.ts';

dotenv.config();

interface Tokens {
  apiKey: string;
  apiToken: string;
}

interface AuthResponse {
  result: {
    accessToken: string;
  };
}

class auvoService {
  API_KEY: string | undefined;
  API_TOKEN: string | undefined;

  constructor() {
    this.API_KEY = process.env.AUVO_APIKEY;
    this.API_TOKEN = process.env.AUVO_APITOKEN;
  }

  async request<T>(
    url: string,
    method: string = 'GET',
    header?: HeadersInit,
    body?: object | null,
  ): Promise<T | null> {
    interface Options {
      method: string;
      headers?: HeadersInit;
      body?: BodyInit | undefined;
    }

    const options: Options = { method, headers: header };

    if (body && method !== 'GET' && method !== 'DELETE') {
      options.body = JSON.stringify(body);
    }

    const response: Response = await fetch(url, options);
    return response.ok ? (response.json() as Promise<T>) : null;
  }

  async requestAccessToken(): Promise<string | null> {
    if (!this.API_KEY || !this.API_TOKEN) {
      throw new Error('API_KEY or API_TOKEN is not defined');
    }

    const header = {
      'Content-Type': 'application/json',
    };

    const tokensAuvo: Tokens = {
      apiKey: this.API_KEY,
      apiToken: this.API_TOKEN,
    };

    const url = urlsRep.loginAuvoURL(tokensAuvo);

    const data = await this.request<AuthResponse>(url, 'POST', header, tokensAuvo);

    return data?.result.accessToken || null;
  }
}

export default auvoService;
const test = new auvoService();

console.log(await test.requestAccessToken());
