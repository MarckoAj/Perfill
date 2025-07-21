import dotenv from 'dotenv';
import urlsRep from '../repositories/urlsRep.ts';
import customDate from '../utils/customDate.ts';
import { AuvoResponse, PagedList } from '../utils/auvoInterfaces.ts';

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

class AuvoService {
  private API_KEY = process.env.AUVO_APIKEY;
  private API_TOKEN = process.env.AUVO_APITOKEN;
  private bearerToken: string | null = null;
  private tokenExpirationDate: string | null = null;

  private isAuthenticated(): boolean {
    return !!this.bearerToken && customDate.isValidTokenTime(this.tokenExpirationDate);
  }

  private hasNextPage<T>(data: AuvoResponse<PagedList<T>>): boolean {
    return data.result?.links?.some((element) => element.rel === 'nextPage') ?? false;
  }

  private async request<T>(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async handleEntityRequest<T>(endpoint: string, id?: number, method = 'GET'): Promise<T | null> {
    const header = await this.auvoHeaderAuthorization();
    const baseUrl = urlsRep.auvoBaseUrl();
    const path = id !== undefined ? `${endpoint}/${id}` : endpoint;
    const url = `${baseUrl}/${path}`;
    const response = await this.request<AuvoResponse<T>>(url, method, header);
    return response?.result ?? null;
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
      const url = `${urlsRep.auvoBaseUrl()}/login`;
      const data = await this.request<AuthResponse>(
        url,
        'POST',
        { 'Content-Type': 'application/json' },
        tokensAuvo,
      );
      console.log(data);
      this.bearerToken = data.result.accessToken;
      this.tokenExpirationDate = data.result.expiration;
    } catch (error) {
      this.bearerToken = null;
      this.tokenExpirationDate = null;
      console.error('Erro ao obter token:', error);
      return null;
    }

    return this.bearerToken;
  }

  async auvoHeaderAuthorization(): Promise<Record<string, string>> {
    const token = this.isAuthenticated() ? this.bearerToken : await this.requestAccessToken();

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async requestList<T>(
    endpoint: string,
    params?: object,
    page?: number,
    selectfields?: string[] | string,
  ): Promise<AuvoResponse<PagedList<T>> | null> {
    try {
      const header = await this.auvoHeaderAuthorization();
      const url = urlsRep.requestListAuvoURL(endpoint, params, page, selectfields);
      return await this.request<AuvoResponse<PagedList<T>>>(url, 'GET', header);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async requestListComplete<T>(
    endpoint: string,
    params?: object,
    selectfields?: string[] | string,
  ): Promise<T[]> {
    const completeList: T[][] = [];
    let page = 1;
    let hasLinks = false;

    do {
      const data = await this.requestList<T>(endpoint, params, page, selectfields);
      if (data?.result?.entityList) {
        completeList.push(data.result.entityList);
      }

      page++;
      hasLinks = data ? this.hasNextPage<T>(data) : false;
    } while (hasLinks);

    return completeList.flat();
  }

  async requestTaskList<T = unknown>(
    interval: string = 'dia',
    params: object = {},
    selectfields?: string[] | string,
  ): Promise<T[]> {
    const dateParams = customDate.getDate(interval);
    const allParams = { ...dateParams, ...params };
    return this.requestListComplete<T>('tasks', allParams, selectfields);
  }
}

export default new AuvoService();
