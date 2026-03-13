import "dotenv/config";

const BASE_URL = "https://api.qase.io/v1";

const token = process.env.QASE_API_TOKEN;
if (!token) {
  console.error("Error: QASE_API_TOKEN is not set in .env");
  process.exit(1);
}

export class QaseClient {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      Token: token!,
      "Content-Type": "application/json",
    };
  }

  async get(path: string, params?: Record<string, string>): Promise<unknown> {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }

    const res = await fetch(url.toString(), { headers: this.headers });
    return this.handleResponse(res);
  }

  async post(path: string, body?: unknown): Promise<unknown> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(res);
  }

  private async handleResponse(res: Response): Promise<unknown> {
    const data = await res.json();
    if (!res.ok) {
      const message =
        typeof data === "object" && data !== null && "errorMessage" in data
          ? (data as { errorMessage: string }).errorMessage
          : res.statusText;
      throw new Error(`Qase API error (${res.status}): ${message}`);
    }
    return data;
  }
}
