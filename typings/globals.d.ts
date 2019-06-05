interface IEnv {
  API_BASE: string
  CHAIN_ID: string
  SEED?: string
  accounts?: string[]
}

declare namespace NodeJS {
  interface Global {
    env: IEnv
  }
}

declare module 'recursive-readdir';
declare module 'waves-dev-cli-config.json';
