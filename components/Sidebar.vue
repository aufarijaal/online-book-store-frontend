<script lang="ts" setup>
const menu = [
  {
    "title": "Home",
    "icon": "mdi:home",
    "href": "/admin"
  },
  {
    "title": "Addresses",
    "icon": "mdi:map",
    "href": "/admin/addresses"
  },
  {
    "title": "Authors",
    "icon": "mdi:account-edit",
    "href": "/admin/authors"
  },
  {
    "title": "Books",
    "icon": "mdi:book",
    "href": "/admin/books"
  },
  {
    "title": "Customers",
    "icon": "mdi:account-cash",
    "href": "/admin/customers"
  },
  {
    "title": "Genres",
    "icon": "iconamoon:category-fill",
    "href": "/admin/genres"
  },
  {
    "title": "Orders",
    "icon": "material-symbols:orders",
    "href": "/admin/orders"
  },
]
</script>

<template>
  <aside class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px">
    <a href="/admin" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none gap-3">
      <img width="32" height="32" src="/logo.svg" alt="Brand Logo" />
      <span class="fs-5 fw-bold">Garadia Admin</span>
    </a>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto gap-2">
      <li v-for="(item, i) in menu" :key="i">
        <SidebarNavLink active-class="active" :to="item.href">
          <Icon :name="item.icon" size="24" />
          {{ item.title }}
        </SidebarNavLink>
      </li>
    </ul>
  </aside>
</template>
