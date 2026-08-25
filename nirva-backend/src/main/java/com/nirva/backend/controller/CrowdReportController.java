package com.nirva.backend.controller;

import com.nirva.backend.entity.CrowdReport;
import com.nirva.backend.entity.Notification;
import com.nirva.backend.repository.CrowdReportRepository;
import com.nirva.backend.repository.NotificationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/crowd-reports")
public class CrowdReportController {

    private final CrowdReportRepository crowdReportRepository;

    private final NotificationRepository notificationRepository;


    public CrowdReportController(
            CrowdReportRepository crowdReportRepository,
            NotificationRepository notificationRepository) {

        this.crowdReportRepository =
                crowdReportRepository;

        this.notificationRepository =
                notificationRepository;
    }


    // ==========================================
    // CREATE CROWD REPORT
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createReport(
            @RequestBody CrowdReport report) {


        // Save crowd report

        CrowdReport savedReport =
                crowdReportRepository.save(report);


        // ======================================
        // CREATE NOTIFICATION
        // ======================================

        Notification notification =
                new Notification();


        if ("High".equalsIgnoreCase(
                report.getCrowdLevel())) {


            notification.setTitle(
                    "High Crowd Alert"
            );


            notification.setMessage(
                    report.getTransport()
                    + " is currently crowded at "
                    + report.getLocation()
                    + "."
            );


        } else {


            notification.setTitle(
                    "Crowd Report Submitted"
            );


            notification.setMessage(
                    report.getTransport()
                    + " crowd level at "
                    + report.getLocation()
                    + " is "
                    + report.getCrowdLevel()
                    + "."
            );

        }


        notification.setType(
                "crowd"
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
                savedReport
        );
    }


    // ==========================================
    // GET CROWD REPORTS
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getReports() {

        return ResponseEntity.ok(
                crowdReportRepository.findAll()
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