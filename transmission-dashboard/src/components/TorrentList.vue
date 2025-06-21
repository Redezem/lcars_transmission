<template>
  <div class="torrent-list">
    <h2>Torrents</h2>
    <div v-if="error">{{ error }}</div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <TorrentListItem v-for="torrent in torrents" :key="torrent.id" :torrent="torrent" />
      <div v-if="torrents.length === 0">No torrents found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Torrent } from '../types/transmission';
import { getTorrents } from '../services/transmissionService';
import TorrentListItem from './TorrentListItem.vue';

const torrents = ref<Torrent[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function loadTorrents() {
  isLoading.value = true;
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
  // Optionally, set up polling to refresh torrents periodically
  // setInterval(loadTorrents, 5000); // every 5 seconds
});
</script>

<style scoped>
.torrent-list {
  margin: 20px;
}
</style>
