<?php
$students = json_decode(file_get_contents('results/updated_students2.json'), true);
$roomsWithEvents = json_decode(file_get_contents('results/updated_roomsWithEvents.json'), true);
$foundPossibleRoom = [];

// get me the room with the "name" of 101-C in "rooms" key

//foreach ($roomsWithEvents as $roomsWithEvent) {
//    foreach ($roomsWithEvent['rooms'] as $room) {
//        if ($room['name'] == '101-C') {
//            echo "found room 101-C \n";
//            echo "current capacity: " . $room['currentCapacity'] . "\n";
//        }
//    }
//
//}
//return;


foreach ($students as &$student) {

    if (!isset($student['unAssignedRoom'])) {
        continue;
    }
    $unassignedRooms = $student['unAssignedRoom'];

    foreach ($unassignedRooms as $eventIndex => $unassignedRoomValue)
    {
        if (isset($roomsWithEvents[$eventIndex])) {
            $event = &$roomsWithEvents[$eventIndex];
            foreach ($event['rooms'] as &$room) {
                $eventRoomValue = $room['name'];
                if ($eventRoomValue != $unassignedRoomValue) {

                    // get me the last letter of $name
                    $eventAvailableTimeSlot = substr($eventRoomValue, -1);

                    foreach ($student['assignedRoom'] as $assignedRoomValue) {
                        $assignedUsedTimeSlot = substr($assignedRoomValue, -1);

                        if ($eventAvailableTimeSlot !== $assignedUsedTimeSlot && $room['currentCapacity'] > 0) {
                            $foundPossibleRoom = [$eventAvailableTimeSlot, $eventRoomValue];
                        } else {
                            $foundPossibleRoom = [];
                            break;
                        }
                    }

                    if (count($foundPossibleRoom) > 0) {
                        // array deconstruction to get the values
                        [$eventAvailableTimeSlot, $eventRoomValue] = $foundPossibleRoom;
                        // we can use this timeslot and update the currentCapacity of the room
                        $student['assignedRoom'][(string) $eventIndex] = $eventRoomValue;
                        $room['currentCapacity'] = $room['currentCapacity'] - 1;
                        $student['unAssignedRoom'] = array_diff($student['unAssignedRoom'], [$unassignedRoomValue]);
                        $foundPossibleRoom = [];
                        break;
                    }

//                    echo "could not assign student " . $student['firstname'] . " to the room \n" . $unassignedRoomValue. " for event " . $eventIndex . "\n";
                }
            }
        }
    }
}

file_put_contents('results/updated_roomsWithEvents3.json', json_encode($roomsWithEvents, JSON_PRETTY_PRINT));
file_put_contents('results/updated_students3.json', json_encode($students, JSON_PRETTY_PRINT));