package com.nirva.backend.repository;

import com.nirva.backend.entity.RoadIssue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadIssueRepository
        extends JpaRepository<RoadIssue, Long> {
}