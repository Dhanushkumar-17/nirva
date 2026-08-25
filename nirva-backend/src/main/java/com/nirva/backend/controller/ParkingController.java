package com.nirva.backend.controller;

import com.nirva.backend.entity.Parking;
import com.nirva.backend.repository.ParkingRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    private final ParkingRepository parkingRepository;

    public ParkingController(
            ParkingRepository parkingRepository) {

        this.parkingRepository = parkingRepository;
    }

    // Get all parking locations
    @GetMapping
    public ResponseEntity<?> getParking() {

        return ResponseEntity.ok(
                parkingRepository.findAll()
        );
    }

    // Add parking location
    @PostMapping
    public ResponseEntity<?> addParking(
            @RequestBody Parking parking) {

        Parking savedParking =
                parkingRepository.save(parking);

        return ResponseEntity.ok(savedParking);
    }

    // Delete parking location
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParking(
            @PathVariable Long id) {

        parkingRepository.deleteById(id);

        return ResponseEntity.ok(
                "Parking deleted successfully"
        );
    }
}