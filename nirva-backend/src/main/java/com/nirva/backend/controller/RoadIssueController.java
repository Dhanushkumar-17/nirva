package com.nirva.backend.controller;

import com.nirva.backend.entity.RoadIssue;
import com.nirva.backend.entity.Notification;
import com.nirva.backend.repository.RoadIssueRepository;
import com.nirva.backend.repository.NotificationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/road-issues")
public class RoadIssueController {

    private final RoadIssueRepository repository;

    private final NotificationRepository notificationRepository;


    public RoadIssueController(
            RoadIssueRepository repository,
            NotificationRepository notificationRepository) {

        this.repository = repository;

        this.notificationRepository =
                notificationRepository;
    }


    // ==========================================
    // CREATE ROAD ISSUE
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createIssue(
            @RequestBody RoadIssue issue) {


        // Default status

        if (issue.getStatus() == null ||
            issue.getStatus().isBlank()) {

            issue.setStatus("Reported");
        }


        // Save road issue

        RoadIssue savedIssue =
                repository.save(issue);


        // ======================================
        // CREATE NOTIFICATION
        // ======================================

        Notification notification =
                new Notification();


        notification.setTitle(
                "Road Issue Reported"
        );


        notification.setMessage(
                issue.getIssueType()
                + " reported at "
                + issue.getLocation()
                + "."
        );


        notification.setType(
                "road"
        );


        notification.setReadStatus(
                false
        );


        notification.setCreatedAt(
                getCurrentDate()
        );


        notificationRepository.save(
                notification
        );


        return ResponseEntity.ok(
                savedIssue
        );
    }


    // ==========================================
    // GET ALL ROAD ISSUES
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getIssues() {

        return ResponseEntity.ok(
                repository.findAll()
        );
    }


    // ==========================================
    // DELETE ROAD ISSUE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIssue(
            @PathVariable Long id) {


        if (!repository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        repository.deleteById(id);


        return ResponseEntity.ok(
                "Road issue deleted successfully."
        );
    }


    // ==========================================
    // CURRENT DATE & TIME
    // ==========================================

    private String getCurrentDate() {

        return LocalDateTime.now()
                .format(
                    DateTimeFormatter.ofPattern(
                        "dd MMM yyyy, hh:mm a"
                    )
                );
    }
}