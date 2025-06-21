<template>
  <div class="torrent-list-item">
    <p><strong>{{ torrent.name }}</strong></p>
    <p>Status: {{ torrentStatus }}</p>
    <p>Progress: {{ (torrent.percentDone * 100).toFixed(2) }}%</p>
    <p>DL: {{ formatSpeed(torrent.rateDownload) }} | UL: {{ formatSpeed(torrent.rateUpload) }}</p>
    <p>ETA: {{ formatEta(torrent.eta) }}</p>
    <p>Size: {{ formatBytes(torrent.sizeWhenDone) }}</p>
    <p v-if="torrent.errorString">Error: {{ torrent.errorString }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Torrent } from '../types/transmission';
import { computed } from 'vue';

const props = defineProps<{
  torrent: Torrent;
}>();

// Transmission status codes (simplified)
const STATUS_MAP: { [key: number]: string } = {
  0: 'Stopped', // TR_STATUS_STOPPED
  1: 'Queued to check', // TR_STATUS_CHECK_WAIT
  2: 'Checking', // TR_STATUS_CHECK
  3: 'Queued to download', // TR_STATUS_DOWNLOAD_WAIT
  4: 'Downloading', // TR_STATUS_DOWNLOAD
  5: 'Queued to seed', // TR_STATUS_SEED_WAIT
  6: 'Seeding', // TR_STATUS_SEED
};

const torrentStatus = computed(() => {
  return STATUS_MAP[props.torrent.status] || 'Unknown';
});

function formatSpeed(bytes: number): string {
  if (bytes === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatEta(seconds: number): string {
  if (seconds < 0 || seconds === Infinity || seconds === 2**31-1) return '∞'; //Transmission specific value for unknown
  if (seconds === 0) return 'Done';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
}
</script>

<style scoped>
.torrent-list-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
