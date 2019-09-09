interface IEnv {
  accounts: Record<string, string>
  API_BASE: string
  CHAIN_ID: string
  SEED: string
  file: (name?: string) => Promise<string>
}

declare namespace NodeJS {
  interface Global {
    env: IEnv
  }
}

declare module 'recursive-readdir';
declare module 'surfboard.config.json';
declare module 'package.json';
