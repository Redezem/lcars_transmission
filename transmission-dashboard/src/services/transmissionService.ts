import type { Torrent, TransmissionResponse, TransmissionSession } from '../types/transmission';

const RPC_URL = '/transmission/rpc'; // Assuming a proxy is set up in vite.config.ts

interface RequestPayload {
  method: string;
  arguments?: any;
  tag?: number;
}

async function fetchWithSession<T>(payload: RequestPayload, sessionId?: string): Promise<TransmissionResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (sessionId) {
    headers['X-Transmission-Session-Id'] = sessionId;
  }

  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (response.status === 409 && !sessionId) { // CSRF protection, session ID needed
    const newSessionId = response.headers.get('X-Transmission-Session-Id');
    if (newSessionId) {
      return fetchWithSession<T>(payload, newSessionId);
    } else {
      throw new Error('Failed to get X-Transmission-Session-Id');
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as TransmissionResponse<T>;
}

export async function getTorrents(): Promise<Torrent[]> {
  const payload: RequestPayload = {
    method: 'torrent-get',
    arguments: {
      fields: [
        'id',
        'name',
        'status',
        'percentDone',
        'rateDownload',
        'rateUpload',
        'eta',
        'peersGettingFromUs',
        'peersSendingToUs',
        'leftUntilDone',
        'sizeWhenDone',
        'errorString',
      ],
    },
  };
  const response = await fetchWithSession<{ torrents: Torrent[] }>(payload);
  if (response.result === 'success') {
    return response.arguments.torrents;
  } else {
    throw new Error(`Failed to get torrents: ${response.result}`);
  }
}

export async function getSession(): Promise<TransmissionSession> {
  const payload: RequestPayload = {
    method: 'session-get',
  };
  const response = await fetchWithSession<TransmissionSession>(payload);
   if (response.result === 'success') {
    return response.arguments;
  } else {
    throw new Error(`Failed to get session: ${response.result}`);
  }
}

// Add other methods like torrent-add, torrent-remove, torrent-start, torrent-stop, session-set etc. as needed.
