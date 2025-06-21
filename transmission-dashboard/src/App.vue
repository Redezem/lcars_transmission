<template>
  <div id="app" class="lcars-app-container">
    <div id="left-menu" class="lcars-column left-menu">
      <!-- Placeholder for future left menu items -->
      <div class="lcars-element lcars-u-1 lcars-golden-tanoi-bg">NAV 1</div>
      <div class="lcars-element lcars-u-1 lcars-atomic-tangerine-bg">NAV 2</div>
    </div>

    <div class="lcars-column fill">
      <header id="header" class="lcars-row">
        <div class="lcars-elbow left-bottom lcars-golden-tanoi-bg">
          <a>LCARS</a>
        </div>
        <div class="lcars-bar horizontal both-divider bottom">
          <div class="lcars-title right">TRANSMISSION DASHBOARD</div>
        </div>
        <div class="lcars-bar horizontal right-end cap "></div>
      </header>

      <main id="container" class="lcars-column fill">
        <TorrentList />
      </main>

      <footer id="footer" class="lcars-row">
         <div class="lcars-elbow left-top lcars-golden-tanoi-bg"></div>
         <div class="lcars-bar horizontal both-divider bottom fill"></div>
         <div class="lcars-bar horizontal right-end cap"></div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import TorrentList from './components/TorrentList.vue';
</script>

<style>
/* Remove previous global styles, as lcars.css handles the base styling */
/* Keep any component-specific styles within their respective .vue files */

/* It might be necessary to add some overrides or adjustments here if lcars.css
   doesn't perfectly align with the Vite/Vue component structure.
   For example, ensuring the app container takes full viewport height. */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevents scrollbars on body due to LCARS fixed elements */
}

#app.lcars-app-container {
  height: 100vh; /* Ensure the main container takes full viewport height */
  box-sizing: border-box;
}

/* Make sure the main content area scrolls if content overflows */
#container {
  overflow-y: auto;
}
</style>
