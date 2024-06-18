<template>
  <div class="profile-tab-content d-flex flex-column gap-2 align-items-start">
    <section class="name-section w-100 border-bottom mb-4 pb-4">
      <FormsProfileName />
    </section>

    <section class="email-section w-100 border-bottom mb-4 pb-4">
      <FormsProfileEmail />
    </section>

    <section class="password-section w-100">
      <FormsProfilePasswordReset />
    </section>
  </div>
</template>