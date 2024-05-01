export interface JWTPayload {
    sub: number;
    email: string;
    roles: string;
  }

  export interface signJwtAccessTokenResponse {
    access_token: string;
    email: string;
  }

  export interface signJwtRefreshTokenResponse {
    refresh_token: string;
    email: string;
  }


