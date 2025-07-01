<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { onMount, onDestroy } from 'svelte';

  interface TableRow {
    id: number;
    type: string;
}
  
  export let data: {
    tables: { 
      id: number;
      type: string 
    }[];
    error: string | null;
  };

  let typeInput = "";
  let errorMsg: string | null = null;
  let tables = [...data.tables];

  async function addRow() {
    if (typeInput.trim() === "") {
      errorMsg = "Type cannot be empty.";
      return;
    }

    const { data: newTable, error } = await supabase
      .from('tables')
      .insert([{ type: typeInput }])
      .select()

    if (error) {
      console.error(error);
      errorMsg = error.message;
    }
    else if (newTable) {
      //append the new table to the existing list
      tables = [...tables, ...newTable];
      typeInput = ""; // clear the input field
      errorMsg = null; // clear any previous error message
    }
  }   

  onMount(() => {
    const channel = supabase
      .channel('tables-db-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'tables'
        },
        (payload) => {
          console.log('Change received!', payload);

          //example handling for inserts
          if (payload.eventType === 'INSERT' && payload.new && 'id' in payload.new && 'type' in payload.new) {
            tables = [...tables, payload.new as TableRow];
          }
        }
      )
      .subscribe();

      onDestroy(() => {
        supabase.removeChannel(channel);
      })
  })
</script>

<main class ="p-8 max-w-xl mx-auto">
  <h1 class="text-3lx font-bold mb-4">Tables Test</h1>

  {#if errorMsg}
    <div class="text-red-500 mb-4">
      {errorMsg}
    </div>
  {/if}

  <div class="mb-6 flex gap-2">
    <input
      bind:value={typeInput}
      placeholder="Enter table type"
      class="border border-gray-300 p-2 rounded w-full"
    />
    <button
      on:click={addRow}
      class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >Add</button>
  </div>

  <h2 class="text-xl font-semibold mb-2">All rows:</h2>
  <table class="min-w-full border border-gray-300">
    <thead>
      <tr class="bg-gray-100">
        <th class="border p-2">ID</th>
        <th class="border p-2">Type</th>
      </tr>
    </thead>
    <tbody>
      {#each tables as table}
        <tr>
          <td class="border p-2">{table.id}</td>
          <td class="border p-2">{table.type}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>