<template>
  <div class="page-header">
    <div class="header-left">
      <a class="logo" href="https://vxeui.com">
        <img src="https://vxeui.com/logo.png">
        <span class="title">Vxe UI</span>
      </a>
    </div>
    <div class="header-middle"></div>
    <div class="header-right">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 50px;
  border-bottom: 1px #888;
  .header-left,
  .header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
  }
  .header-right {
    padding: 0 16px;
  }
  .header-middle {
    flex-grow: 1;
  }
  .header-left {
    padding: 0 16px;
    .logo {
      text-decoration: none;
      color: var(--vxe-ui-font-primary-color);
      padding: 0 0.4em;
      font-weight: 700;
      font-size: 18px;
      padding: 0 8px;
      cursor: pointer;
      img {
        height: 20px;
        margin-right: 16px;
      }
      img,
      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .pendant {
      display: none;
    }
  }
}
</style>
