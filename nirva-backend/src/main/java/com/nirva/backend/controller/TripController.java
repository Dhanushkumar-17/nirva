package com.nirva.backend.controller;

import com.nirva.backend.entity.Trip;
import com.nirva.backend.repository.TripRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripRepository tripRepository;

    public TripController(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    @PostMapping
    public ResponseEntity<?> saveTrip(@RequestBody Trip trip) {

        Trip savedTrip = tripRepository.save(trip);

        return ResponseEntity.ok(savedTrip);
    }

    @GetMapping
    public ResponseEntity<?> getTrips() {

        return ResponseEntity.ok(
                tripRepository.findAll()
        );
    }
}