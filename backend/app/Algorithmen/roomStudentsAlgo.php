<?php

// Load and decode JSON data
$studentsJson = file_get_contents('results/students2.json');
$roomsJson = file_get_contents('results/roomsWithEvents.json');

$students = json_decode($studentsJson, true)['students'];
$roomsWithEvents = json_decode($roomsJson, true);

// Iterate over students
foreach ($students as &$student) {
    $usedLetters = [];

    // Iterate over assigned events for each student
    foreach ($student['assignedEvents'] as $event) {
        foreach ($roomsWithEvents as $eventKey => &$roomEvent) {
            if ($eventKey == $event) {
                // Find a suitable room based on the last letter
                foreach ($roomEvent['rooms'] as &$room) {
                    if ($room['currentCapacity'] == 0) {
                        echo "The current room is full. \n";
                        continue;
                    }
                    $lastLetter = substr($room['name'], -1);

                    // Check if the letter has not been used and assign the room
                    if (!in_array($lastLetter, $usedLetters)) {
                        $student['assignedRoom'][$event] = $room['name'];
                        $room['currentCapacity'] -= 1;
                        $usedLetters[] = $lastLetter;
                        break;
                    }
                    if (in_array($lastLetter, $usedLetters)) {
                        $student['unAssignedRoom'][$event] = $room['name'];
                        $usedLetters[] = $lastLetter;
                        break;
                    }
                }
            }
        }
    }
}

// Output the result
file_put_contents('results/updated_roomsWithEvents.json', json_encode($roomsWithEvents, JSON_PRETTY_PRINT));
file_put_contents('results/updated_students2.json', json_encode($students, JSON_PRETTY_PRINT));