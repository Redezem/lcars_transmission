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
import { getTorrents, addTorrent } from '../services/transmissionService';
import TorrentListItem from './TorrentListItem.vue';

const torrents = ref<Torrent[]>([]);
const newMagnetLink = ref('');
const addTorrentMessage = ref<string | null>(null);
const addTorrentError = ref<string | null>(null);
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

async function handleAddTorrent() {
  if (!newMagnetLink.value.trim()) {
    addTorrentError.value = "Magnet link cannot be empty.";
    addTorrentMessage.value = null;
    return;
  }
  addTorrentError.value = null;
  addTorrentMessage.value = null;

  try {
    const result = await addTorrent(newMagnetLink.value.trim());
    // Example success message, adjust based on actual API response structure
    if (result && result['torrent-added'] && result['torrent-added'].name) {
        addTorrentMessage.value = `Torrent "${result['torrent-added'].name}" added successfully.`;
    } else if (result && result['torrent-duplicate'] && result['torrent-duplicate'].name) {
        addTorrentMessage.value = `Torrent "${result['torrent-duplicate'].name}" already exists.`;
         // Consider if this should be an error or just info
    }
    else {
        addTorrentMessage.value = 'Torrent added successfully (or already exists).';
    }
    newMagnetLink.value = ''; // Clear input
    await loadTorrents(); // Refresh the list
  } catch (e: any) {
    console.error("Failed to add torrent:", e);
    addTorrentError.value = e.message || 'Failed to add torrent.';
  }
}
</script>

<template>
  <div class="torrent-list lcars-column fill">
    <div class="lcars-row">
      <div class="lcars-bar horizontal both-divider bottom">
        <div class="lcars-title">TORRENT STATUS</div>
      </div>
      <div class="lcars-bar horizontal right-end cap"></div>
    </div>

    <!-- Add Torrent Section -->
    <div class="lcars-row add-torrent-section">
      <div class="lcars-text-box lcars-u-1-1">
        <input type="text" v-model="newMagnetLink" placeholder="Enter magnet link" class="lcars-input"/>
        <button @click="handleAddTorrent" class="lcars-element button lcars-neon-carrot-bg">ADD TORRENT</button>
      </div>
    </div>
    <div v-if="addTorrentMessage" class="lcars-text-box lcars-u-1-1 lcars-dodger-blue-bg feedback-message">
      <p>{{ addTorrentMessage }}</p>
    </div>
    <div v-if="addTorrentError" class="lcars-text-box lcars-u-1-1 lcars-red-alert-bg feedback-message">
      <p>{{ addTorrentError }}</p>
    </div>
    <!-- End Add Torrent Section -->

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

.add-torrent-section {
  margin-bottom: 0.5rem; /* Standard LCARS spacing */
}

.lcars-input {
  background-color: var(--lcars-black, #000);
  color: var(--lcars-anakiwa, #9CF); /* Light blue text, common for LCARS inputs */
  border: 2px solid var(--lcars-anakiwa, #9CF);
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem; /* Space between input and button */
  flex-grow: 1; /* Allow input to take available space */
  font-family: 'LCARS', sans-serif; /* Assuming LCARS font is globally available */
  text-transform: uppercase;
}

.lcars-input::placeholder {
  color: var(--lcars-anakiwa-dim, #69B); /* Dimmer color for placeholder */
}

.lcars-element.button.lcars-neon-carrot-bg {
    color: var(--lcars-black, #000); /* Black text on orange button */
    height: auto; /* Adjust height to content */
    padding: 0.3rem 0.5rem; /* Slightly more padding for button text */
    line-height: 1.2;
}

.feedback-message p {
  margin: 0.1rem 0.25rem; /* Tighter margins for feedback messages */
  padding: 0.1rem 0.25rem;
}
.lcars-dodger-blue-bg { background-color: var(--lcars-dodger-blue, #39f); color: var(--lcars-black, #000); }


/* Ensure the header bar is styled correctly */
.lcars-bar .lcars-title {
  color: #000; /* Black text on colored bars */
  background-color: transparent; /* Title text should not have its own black background here */
  padding-bottom: 0; /* Adjust if needed */

}
</style>
