<script lang="ts">
  import { post } from "../api";
  let Item: string;
  let Name: string;
  let Unit: string;
  let Weight: string;

  const addTicket = async () => {
    const tickets = [Item, Name, Unit, Weight];
    if (tickets.some((input) => !input)) {
      return;
    }
    await post("/addticket", {
      Item,
      Name,
      Unit,
      Weight,
    });
  };
</script>

<div id="testing-container">
  Agregar ticket:
  <label for="Item">Item:</label><input
    bind:value={Item}
    type="text"
    class="add-ticket-input"
    name="Item"
    placeholder="Item"
  />
  <label for="Name">Nombre:</label><input
    bind:value={Name}
    type="text"
    class="add-ticket-input"
    name="Name"
    placeholder="Nombre"
  />
  <label for="Unit">Unidad:</label><input
    bind:value={Unit}
    type="text"
    class="add-ticket-input"
    name="Unit"
    placeholder="Unidad"
  />
  <label for="Weight">Peso/Unidad:</label><input
    bind:value={Weight}
    class="add-ticket-input"
    type="number"
    name="Weight"
    placeholder="Peso/Unidad"
  />
  <button type="submit" id="add-ticket-button" on:click={addTicket}>Crear Ticket</button>
</div>
