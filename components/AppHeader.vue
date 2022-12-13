<template>
  <div class="col-12 border-none border-bottom-1 border-solid border-200 flex flex-row justify-content-between align-items-center p-0">
    <div>
      <ul class="list-none p-0 m-0 flex align-items-center gap-2">
        <Button icon="pi pi-home" class="p-button-text" @click="navigateTo('/')"/>
      </ul>
    </div>
    <div>
      <ul class="list-none p-0 m-0 flex align-items-center gap-2">
        <Button icon="pi pi-cog" class="p-button-text"  @click="navigateTo('/detectee_settings')"/>
      </ul>
    </div>
  </div>
</template>
