package com.nirva.backend.repository;

import com.nirva.backend.entity.Parking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository
        extends JpaRepository<Parking, Long> {
}