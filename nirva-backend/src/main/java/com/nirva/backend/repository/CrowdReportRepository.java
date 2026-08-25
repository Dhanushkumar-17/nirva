package com.nirva.backend.repository;

import com.nirva.backend.entity.CrowdReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrowdReportRepository
        extends JpaRepository<CrowdReport, Long> {
}