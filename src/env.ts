interface AppEnv {
  siteTitle: string;
  apkDownloadUrl: string;
  adminUrl: string;
  backendPingUrl: string;
  requestTimeoutMs: number;
}

const rawEnv = import.meta.env;
const envErrors: string[] = [];

const readRequired = (key: keyof ImportMetaEnv): string => {
  const value = rawEnv[key];

  if (typeof value !== 'string' || value.trim() === '') {
    envErrors.push(`${String(key)} is missing. Add it to your .env file.`);
    return '';
  }

  return value.trim();
};

const readPositiveNumber = (
  key: keyof ImportMetaEnv,
  fallback: number
): number => {
  const value = rawEnv[key];

  if (typeof value !== 'string' || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    envErrors.push(
      `${String(key)} must be a positive number. Received: "${value}".`
    );
    return fallback;
  }

  return Math.floor(parsed);
};

export const appEnv: AppEnv = {
  siteTitle: readRequired('VITE_SITE_TITLE') || 'Conjugamos',
  apkDownloadUrl: readRequired('VITE_APK_DOWNLOAD_URL'),
  adminUrl: readRequired('VITE_ADMIN_URL'),
  backendPingUrl: readRequired('VITE_BACKEND_PING_URL'),
  requestTimeoutMs: readPositiveNumber('VITE_REQUEST_TIMEOUT_MS', 5000)
};

if (envErrors.length > 0) {
  console.error('[Conjugamos config] Environment configuration issues found:');
  envErrors.forEach((error) => {
    console.error(`- ${error}`);
  });
  console.error('Please review .env and restart Vite.');
}
