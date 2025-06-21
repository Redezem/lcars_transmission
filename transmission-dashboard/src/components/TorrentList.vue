<template>

  <div class="torrent-list lcars-column fill">
    <div class="lcars-row">
      <div class="lcars-bar horizontal both-divider bottom">
        <div class="lcars-title">TORRENT STATUS</div>
      </div>
      <div class="lcars-bar horizontal right-end cap"></div>
    </div>

    <div v-if="error" class="lcars-text-box lcars-u-1-1 lcars-red-alert-bg">
      <p>Error loading torrents: {{ error }}</p>
    </div>
    <div v-if="isLoading && !error" class="lcars-text-box lcars-u-1-1 lcars-blue-bell-bg">
      <p>Loading torrent data...</p>
    </div>

    <div v-if="!isLoading && !error && torrents.length === 0" class="lcars-text-box lcars-u-1-1 lcars-golden-tanoi-bg">
      <p>No torrents active or available.</p>
    </div>

    <div class="lcars-column fill scrollable-content" v-if="!isLoading && torrents.length > 0">
      <TorrentListItem v-for="torrent in torrents" :key="torrent.id" :torrent="torrent" />

    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue';

import type { Torrent } from '../types/transmission';
import { getTorrents } from '../services/transmissionService';
import TorrentListItem from './TorrentListItem.vue';

const torrents = ref<Torrent[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

let pollInterval: number | undefined;

async function loadTorrents() {
  // isLoading.value = true; // Keep existing list visible while loading

  error.value = null;
  try {
    torrents.value = await getTorrents();
  } catch (e: any) {
    console.error("Failed to load torrents:", e);
    error.value = e.message || 'Failed to load torrents.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadTorrents();

  pollInterval = setInterval(loadTorrents, 5000); // Refresh every 5 seconds
});

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
  }

});
</script>

<style scoped>
.torrent-list {

  padding: 0.25rem; /* Add some padding around the list itself */
}

.scrollable-content {
  overflow-y: auto; /* Allow scrolling for the list of torrents */
  flex-grow: 1; /* Ensure it takes available space */
  padding-right: 0.25rem; /* Space for scrollbar if needed, aligns with LCARS spacing */
}

/* LCARS color classes for text boxes */
.lcars-red-alert-bg { background-color: var(--lcars-red-alert, #e10); color: var(--lcars-black, #000); }
.lcars-blue-bell-bg { background-color: var(--lcars-blue-bell, #99c); color: var(--lcars-black, #000); }
.lcars-golden-tanoi-bg { background-color: var(--lcars-golden-tanoi, #fc6); color: var(--lcars-black, #000); }

.lcars-text-box p {
  margin: 0.25rem;
  padding: 0.25rem;
  text-transform: uppercase;
}

/* Ensure the header bar is styled correctly */
.lcars-bar .lcars-title {
  color: #000; /* Black text on colored bars */
  background-color: transparent; /* Title text should not have its own black background here */
  padding-bottom: 0; /* Adjust if needed */

}
</style>
