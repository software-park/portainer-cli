import { jwtDecode } from "jwt-decode";

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
interface PortainerClientOptions {
  url: string;
  key?: string;
  username?: string;
  password?: string;
}

class PortainerClient {
  private username?: string;
  private password?: string;
  private key?: string;
  private baseURL: string;
  private authToken?: string;
  private refreshAuthTokenPromise?: Promise<void>;

  constructor(options: PortainerClientOptions) {
    if (!PortainerClient.validURL(options.url)) throw new Error("Invalid URL");

    if (!options.key && !options.username && !options.password)
      throw new Error("Either a key or username and password is required");

    if (options.key && options.username && options.password)
      throw new Error(
        "Conflicting key and username and password options are set",
      );

    if (options.username && options.password) {
      this.username = options.username;
      this.password = options.password;
    } else if (options.key) {
      this.key = options.key;
    }

    this.baseURL = options.url.replace(/\/$/, "");
  }

  /**
   * Returns headers for an authenticated API call
   * When using username/password, the auth token is refreshed if it expires within the next minute
   */
  async getAPIAuthHeaders() {
    if (this.key) {
      return {
        "X-API-Key": this.key,
      };
    } else {
      if (this.authToken) {
        const currentTime = Math.floor(Date.now() / 1000);
        const decodedAuthToken = jwtDecode(this.authToken);
        const exp = decodedAuthToken.exp ?? 0;

        if (exp - currentTime <= 60) {
          // expires in < 1 minute
          await this.refreshAuthToken();
        }

      } else {
        await this.refreshAuthToken();
      }

      return {
        Authorization: `Bearer ${this.authToken}`,
      };
    }
  }

  /**
   * Refreshes the auth token when using username/password auth
   * @returns {Promise<unknown>}
   * @private
   */
  private refreshAuthToken() {
    if (this.username && this.password) {
      if (!this.refreshAuthTokenPromise) {
        this.refreshAuthTokenPromise = new Promise((resolve, reject) => {
          (async () => {
            try {
              const authData = await this.callAPI("POST", "/api/auth", {
                username: this.username,
                password: this.password,
              });

              this.authToken = authData.jwt;

              resolve();
            } catch (error) {
              reject(error);
            } finally {
              delete this.refreshAuthTokenPromise;
            }
          })();
        });
      }

      return this.refreshAuthTokenPromise;
    }
  }

  /**
   * Calls the Portainer API, injecting the required auth
   */
  async callAPIWithKey(
    requestMethod: RequestMethod,
    apiPath: string,
    requestData?: any,
    requestHeaders = {},
  ) {
    const apiAuthHeaders = await this.getAPIAuthHeaders();

    const apiMergedHeaders = {
      ...apiAuthHeaders,
      ...requestHeaders,
    };

    return await this.callAPI(
      requestMethod,
      apiPath,
      requestData,
      apiMergedHeaders,
    );
  }

  /**
   * Calls the Portainer API without authentication
   */
  async callAPI(requestMethod: RequestMethod, apiPath: string, requestData?: any, requestHeaders = {}) {
    const url = new URL(apiPath, this.baseURL);

    const options = {
      method: requestMethod.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...requestHeaders,
      },
      body: requestData ? JSON.stringify(requestData) : undefined,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.log(
        `Request to ${url} failed with status ${response.status}`,
        await response.text(),
      );

      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  static validURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (_error) {
      return false;
    }
  }
}

export default PortainerClient;
