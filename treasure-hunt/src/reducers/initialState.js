export const initialState = {
  gameplay: {
    room_id: 0,
    name: "",
    player_name: "",
    title: "",
    description: "",
    coordinates: "",
    exits: [],
    cooldown: 1.0,
    errors: [],
    messages: [],
    encumbrance: 2, //How much are you carrying?
    strength: 10, //How much can you carry?
    speed: 10, //How fast do you travel?
    gold: 0,
    elevation: 0,
    terrain: "",
    bodywear: null,
    footwear: null,
    inventory: [],
    abilities: [],
    status: [],
    items: [],
    isLoading: false,
    errorMessage: "",
    coins: 0
  }
};
