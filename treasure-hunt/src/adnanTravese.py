
# Fill this out with directions to walk
# traversal_path = ['n', 'n']
traversal_path = []

# Store entire map as graph dictionary
map_graph = {}


def player_travel_direction(direction):
    return player.travel(direction)


# create basic dictionary for each room when visited
def current_room_vertex():
    room = {}
    for exit in player.current_room.get_exits():
        room[exit] = "?"
        map_graph[player.current_room.id] = room


# Algorithm to find random exit that hasn't been explored yet
def current_room_unexplored_exit():
    # Track the unexplored exits
    unexplored = []
    # find the exits in a current room
    for exit in player.current_room.get_exits():
        # Check whether given exits is has '?" for being unexplored
        if map_graph[player.current_room.id][exit] == "?":
            unexplored.append(exit)

    # Randomize the choice from unexplored exits and return as a string
    return random.choice(unexplored)

# BFT function to find nearest '?' unexplored exit
# Returns a list of room ids needed to get to first room with unexplored exits


def find_nearest_unexplored_exit(room_id):
    visited = set()
    q = Queue()
    q.enqueue([room_id])

    while q.size() > 0:
        path = q.dequeue()
        current_room = path[-1]
        # Check first after dequeue whether this room has unexplored exits, return path immediately
        if list(map_graph[current_room].values()).count('?') != 0:
            return path
        if current_room not in visited:
            visited.add(current_room)
            # After current room added to visted, we need queue up rooms that needs to check for unexplored exits
            for new_room in map_graph[current_room].values():
                new_path = path.copy()
                new_path.append(new_room)
                q.enqueue(new_path)


# Initialize the map graph building at first location
current_room_vertex()
# Loop through map and build a graph, check against given size from room_graph
while len(map_graph) < len(room_graph):
    '''
    We have two possibilities, we need to go down the path of rooms which have ?
    And we need to go back via BFS to find next unexplored room, while doing so we find out room id and attach it
    '''
    # Player object contains move commands linking to Room object and current room is stored in player
    # Check inside of map_graph for current room, find where given room still have '?' exits remaining
    # list of values is returned and if count is zero, then that room has no more unexplored exits, time to back track via BFS
    if list(map_graph[player.current_room.id].values()).count('?') != 0:
        # Track room numbers, so it can be assigned
        room_id_before_move = player.current_room.id
        # do traversal in random direction
        random_exit = current_room_unexplored_exit()
        # move in that direction to the other room
        player_travel_direction(random_exit)
        # Add to Traversal-Path
        traversal_path.append(random_exit)
        # Check the room moved into is part of created map_graph, otherwise create a new vertex/room
        if player.current_room.id not in map_graph:
            current_room_vertex()
        # Assign room number to previous room exits
        map_graph[room_id_before_move][random_exit] = player.current_room.id
        # Assign previous room id to current room but direction needs to be flipped
        flipped_direction = {'n': 's', 's': 'n', 'e': 'w', 'w': 'e', }
        map_graph[player.current_room.id][flipped_direction[random_exit]
                                          ] = room_id_before_move
    else:
        # Do BFT to find nearest room with '?'
        # Room Path inside of BFT should hold room_id, this can be used to create the edges between rooms. Thus completing the graph.
        backward_path = find_nearest_unexplored_exit(player.current_room.id)
        # Use backward_path to move the player back
        # Path needs to be converted to traversal_path directions
        for each_room_id in backward_path:
            # For each of the directions in a room
            for each_direction in map_graph[player.current_room.id]:
                # Match which room id matches
                if map_graph[player.current_room.id][each_direction] == each_room_id:
                    # move the player and add to traversal_path
                    player.travel(each_direction)
                    traversal_path.append(each_direction)
                    # Break out the inner loop as it just moved the player
                    break
                # Check for next room location
