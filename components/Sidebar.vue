<script lang="ts" setup>
onMounted(() => {});
</script>

<template>
  <aside
    class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
    style="width: 280px"
  >
    <a
      href="/admin"
      class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none gap-3"
    >
      <img width="32" height="32" src="/logo.svg" alt="Brand Logo" />
      <span class="fs-5 fw-bold">Garadia Admin</span>
    </a>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto gap-2">
      <li>
        <SidebarNavLink active-class="active" to="/admin">
          <DashboardIcon />
          Dashboard
        </SidebarNavLink>
      </li>

      <li>
        <SidebarNavLink active-class="active" to="/admin/books">
          <BookIcon />
          Books
        </SidebarNavLink>
      </li>

      <li>
        <SidebarNavLink active-class="active" to="/admin/genres">
          <GenreIcon />
          Genres
        </SidebarNavLink>
      </li>

      <li>
        <SidebarNavLink active-class="active" to="/admin/orders">
          <OrderIcon />
          Orders
        </SidebarNavLink>
      </li>

      <li>
        <SidebarNavLink active-class="active" to="/admin/customers">
          <CustomerIcon />
          Customers
        </SidebarNavLink>
      </li>

      <li>
        <SidebarNavLink active-class="active" to="/admin/authors">
          <AuthorIcon />
          Authors
        </SidebarNavLink>
      </li>

      <li>
        <SidebarNavLink active-class="active" to="/admin/addresses">
          <AddressIcon />
          Addresses
        </SidebarNavLink>
      </li>
    </ul>
  </aside>
</template>
