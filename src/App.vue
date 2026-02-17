<template>
  <div class="app">
    <nav>
      <router-link to="/cashier">Kasir</router-link>
      <router-link to="/products">Produk</router-link>
      <router-link to="/report">Laporan</router-link>
    </nav>

    <router-view />
  </div>
</template>