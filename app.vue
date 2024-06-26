<script setup>
defineAppConfig({
  globalProperties: {
    $api: {
      get: async (url) => {
        try {
          const response = await fetch(url);
          return await response.json();
        } catch (error) {
          console.error(error);
        }
      },
      post: async (url, data) => {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          return await response.json();
        } catch (error) {
          console.error(error);
        }
      },
      put: async (url, data) => {
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          return await response.json();
        } catch (error) {
          console.error(error);
        }
      },
      delete: async (url) => {
        try {
          const response = await fetch(url, {
            method: "DELETE",
          });
          return await response.json();
        } catch (error) {
          console.error(error);
        }
      },
    },
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
