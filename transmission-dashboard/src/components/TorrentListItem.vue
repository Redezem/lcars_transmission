<template>

  <div class="torrent-list-item lcars-row lcars-u-1-1 lcars-black-bg">
    <div class="lcars-column fill">
      <div class="lcars-text-box lcars-u-1 lcars-golden-tanoi-color header-text">{{ torrent.name }}</div>
      <div class="lcars-row">
        <div class="lcars-text-box lcars-u-2-3 lcars-anakiwa-color">Status: {{ torrentStatus }}</div>
        <div class="lcars-text-box lcars-u-1-3 lcars-anakiwa-color text-right">ETA: {{ formatEta(torrent.eta) }}</div>
      </div>
      <div class="lcars-row">
        <div class="lcars-text-box lcars-u-2-3 lcars-anakiwa-color">Progress: {{ (torrent.percentDone * 100).toFixed(1) }}%</div>
        <div class="lcars-text-box lcars-u-1-3 lcars-anakiwa-color text-right">Size: {{ formatBytes(torrent.sizeWhenDone) }}</div>
      </div>
      <div class="lcars-row">
        <div class="lcars-text-box lcars-u-1 lcars-hopbush-color">DL: {{ formatSpeed(torrent.rateDownload) }}</div>
        <div class="lcars-text-box lcars-u-1 lcars-hopbush-color text-right">UL: {{ formatSpeed(torrent.rateUpload) }}</div>
      </div>
      <div v-if="torrent.errorString" class="lcars-text-box lcars-u-1 lcars-red-alert-color">{{ torrent.errorString }}</div>
    </div>
    <!-- Placeholder for action buttons -->
    <!-- <div class="lcars-column">
      <button class="lcars-element button lcars-u-1 lcars-neon-carrot-bg">START</button>
      <button class="lcars-element button lcars-u-1 lcars-red-damask-bg">STOP</button>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import type { Torrent } from '../types/transmission';
import { computed } from 'vue';

const props = defineProps<{
  torrent: Torrent;
}>();


const STATUS_MAP: { [key: number]: string } = {
  0: 'Stopped',
  1: 'Queued Check',
  2: 'Checking',
  3: 'Queued DL',
  4: 'Downloading',
  5: 'Queued Seed',
  6: 'Seeding',
};

const torrentStatus = computed(() => {
  return STATUS_MAP[props.torrent.status] || 'Unknown';
});

function formatSpeed(bytes: number): string {
  if (bytes === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];

}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatEta(seconds: number): string {
  if (seconds < 0 || seconds === Infinity || seconds === 2**31 - 1) return '∞';
  if (seconds === 0 && props.torrent.percentDone === 1) return 'Done';
  if (seconds === 0) return 'Stalled'; // Or ∞ if preferred for 0 eta but not done
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
}
</script>

<style scoped>
.torrent-list-item {
  border: 2px solid var(--lcars-hopbush-color, #c69); /* Default to a common LCARS color */
  margin-bottom: 0.5rem; /* Standard LCARS spacing */
  padding: 0.25rem;
  background-color: var(--lcars-black-bg, #000); /* Ensure black background */
  min-height: 6.25rem; /* lcars-u-1-2 height */
}

.lcars-text-box {
  padding: 0.1rem 0.25rem; /* Reduced padding for denser info */
  margin-bottom: 0.1rem; /* Tighter spacing */
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: auto; /* Allow height to adjust to content a bit */
  line-height: 1.2; /* Adjust line height for readability */
}

.header-text {
  font-size: 120%; /* Slightly larger for the name */
  font-weight: bold;
}

.text-right {
  text-align: right;
}

/* Use LCARS color variables if available, or fallback to hex codes */
.lcars-golden-tanoi-color { color: var(--lcars-golden-tanoi, #fc6); }
.lcars-anakiwa-color { color: var(--lcars-anakiwa, #9cf); }
.lcars-hopbush-color { color: var(--lcars-hopbush, #c69); }
.lcars-red-alert-color { color: var(--lcars-red-alert, #e10); }
.lcars-neon-carrot-bg { background-color: var(--lcars-neon-carrot, #f93); }
.lcars-red-damask-bg { background-color: var(--lcars-red-damask, #d64); }

/* Ensure buttons and other elements fit well */
.lcars-element.button {
  height: 1.5rem; /* Adjust to fit better if needed */
  width: auto;
  padding: 0 0.5rem;
  font-size: 90%;
  margin-top: 0.1rem;
}
</style>
