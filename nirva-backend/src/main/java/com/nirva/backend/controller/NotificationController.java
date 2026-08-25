package com.nirva.backend.controller;

import com.nirva.backend.entity.Notification;
import com.nirva.backend.repository.NotificationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(
            NotificationRepository notificationRepository) {

        this.notificationRepository = notificationRepository;
    }


    // GET ALL NOTIFICATIONS
    @GetMapping
    public ResponseEntity<?> getNotifications() {

        return ResponseEntity.ok(
                notificationRepository.findAll()
        );
    }


    // CREATE NOTIFICATION
    @PostMapping
    public ResponseEntity<?> createNotification(
            @RequestBody Notification notification) {

        Notification saved =
                notificationRepository.save(notification);

        return ResponseEntity.ok(saved);
    }


    // MARK AS READ
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id) {

        return notificationRepository
                .findById(id)
                .map(notification -> {

                    notification.setReadStatus(true);

                    Notification updated =
                            notificationRepository.save(
                                    notification
                            );

                    return ResponseEntity.ok(updated);

                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // DELETE NOTIFICATION
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id) {

        if (!notificationRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        notificationRepository.deleteById(id);

        return ResponseEntity.ok(
                "Notification deleted successfully."
        );
    }
}