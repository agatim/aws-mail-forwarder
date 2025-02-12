export interface Environment {
  [key: string]: any;
}

export const environment: Environment = {
  ...process.env,
};
