import './style.css';
import { appEnv } from './env';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Root element #app was not found.');
}

const page = document.createElement('main');
page.className = 'page';

const content = document.createElement('section');
content.className = 'content';

const title = document.createElement('h1');
title.className = 'title';
title.textContent = appEnv.siteTitle;

const buttonGroup = document.createElement('div');
buttonGroup.className = 'button-group';

const buildLinkButton = (label: string, href: string): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.className = 'button';
  link.textContent = label;

  if (!href) {
    link.href = '#';
    link.classList.add('button--disabled');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => event.preventDefault());
    return link;
  }

  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
};

const apkButton = buildLinkButton('立即下载 APK', appEnv.apkDownloadUrl);
const adminButton = buildLinkButton('管理员后台', appEnv.adminUrl);

buttonGroup.append(apkButton, adminButton);

const status = document.createElement('p');
status.className = 'status';
status.textContent = 'Checking backend...';

content.append(title, buttonGroup);
page.append(content, status);
root.append(page);

const setStatus = (connected: boolean): void => {
  status.textContent = connected
    ? 'Connected to backend'
    : 'Backend unreachable';
  status.classList.toggle('status--ok', connected);
  status.classList.toggle('status--error', !connected);
};

const checkBackendConnectivity = async (): Promise<void> => {
  if (!appEnv.backendPingUrl) {
    setStatus(false);
    return;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    appEnv.requestTimeoutMs
  );

  try {
    const response = await fetch(appEnv.backendPingUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json, text/plain, */*'
      }
    });

    setStatus(response.ok);
  } catch {
    setStatus(false);
  } finally {
    window.clearTimeout(timeoutId);
  }
};

void checkBackendConnectivity();
