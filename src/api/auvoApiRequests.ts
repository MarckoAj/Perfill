import fetch, { BodyInit, HeadersInit, Response } from 'node-fetch';
import dotenv from 'dotenv';
import urlsRep from '../repositores/urlsRep.ts';
import customDate from '../utils/customDate.ts';

dotenv.config();

interface Tokens {
  apiKey: string;
  apiToken: string;
}

interface AuthResponse {
  result: {
    accessToken: string;
    expiration: string;
  };
}

interface AuvoResponse {
  result: {
    entityList: [];
    pagedSearchReturnData: { order: number; pageSize: number; page: number; totalItems: number };
    links: [{ href: string; rel: string; method: string }];
  };
}

class AuvoService {
  private API_KEY: string | undefined;
  private API_TOKEN: string | undefined;
  private bearerToken: string | null = null;
  private tokenExpirationDate: string | null = null;

  constructor() {
    this.API_KEY = process.env.AUVO_APIKEY;
    this.API_TOKEN = process.env.AUVO_APITOKEN;
  }

  private isAuthenticated(): boolean {
    return !!this.bearerToken && customDate.isValidTokenTime(this.tokenExpirationDate);
  }

  private hasNextPage(data: AuvoResponse): boolean {
    const { result } = data;
    const links = result?.links || [];
    return links.some((element) => element.rel === 'nextPage');
  }

  async request<T>(
    url: string,
    method: string = 'GET',
    header: HeadersInit = {
      'Content-Type': 'application/json',
    },
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
      throw new Error('API_KEY ou API_TOKEN não está definida');
    }

    const tokensAuvo: Tokens = {
      apiKey: this.API_KEY,
      apiToken: this.API_TOKEN,
    };

    try {
      const url = urlsRep.auvoBaseUrl() + '/login';
      const data = await this.request<AuthResponse>(
        url,
        'POST',
        {
          'Content-Type': 'application/json',
        },
        tokensAuvo,
      );
      this.bearerToken = data?.result.accessToken ?? null;
      this.tokenExpirationDate = data?.result.expiration ?? null;
    } catch (error) {
      this.bearerToken = null;
      this.tokenExpirationDate = null;
      console.error('Erro ao obter token:', error);
      return null;
    }

    return this.bearerToken;
  }

  async auvoHeaderAuthorization() {
    const authorizationKey = this.isAuthenticated()
      ? this.bearerToken
      : await this.requestAccessToken();
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorizationKey}`,
    };
    return header;
  }

  async requestList(
    endPoint: string,
    params?: object,
    page?: number,
    selectfields?: string[] | string,
  ): Promise<AuvoResponse | null> {
    try {
      const header = await this.auvoHeaderAuthorization();
      const url = urlsRep.requestListAuvoURL(endPoint, params, page, selectfields);
      const data = await this.request<AuvoResponse>(url, 'GET', header);
      return data ?? null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async requestListComplete(
    endPoint: string,
    params?: object,
    selectfields?: string[] | string,
  ): Promise<object[]> {
    const completeList = [];
    let page = 1;
    let hasLinks = false;

    do {
      const data = await this.requestList(endPoint, params, page, selectfields);

      if (data && data.result) {
        completeList.push(data.result.entityList || data.result);
      }

      page++;
      hasLinks = data ? this.hasNextPage(data) : false;
    } while (hasLinks);

    return completeList.length ? completeList.flat() : completeList;
  }

  async requestTaskList(
    interval: string = 'dia',
    params: object = {},
    selectfields?: string[] | string,
  ) {
    const dateParams = customDate.getDate(interval);
    const paramenters = { ...dateParams, ...params };
    const data = await this.requestListComplete('tasks', paramenters, selectfields);
    return data;
  }
}

export default new AuvoService();
