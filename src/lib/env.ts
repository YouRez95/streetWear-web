const getEnv = (key: string, defaultValue?: string): string => {
  const env = import.meta.env;
  const value = env[key as keyof typeof env] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value as string;
};

export const SERVER_URL = getEnv("VITE_API_URL");
