<script setup>
import axios from "axios";
definePageMeta({
  title: "Asana test",
  layout: "default",
});
const queryClient = useQueryClient();

const { data, error, refetch } = useQuery({
  queryKey: ["projects"],
  queryFn: () => $fetch(`/api/v1?path=projects&name=asana`),
});

console.log(data.data);
</script>

<template>
  <div @click="refetch()">asdf</div>
</template>
