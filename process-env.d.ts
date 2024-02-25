declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URI: string;
      DB_NAME: string;
      BASE_URL: string;
    }
  }
}
