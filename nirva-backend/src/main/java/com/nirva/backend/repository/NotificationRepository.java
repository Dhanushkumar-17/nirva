package com.nirva.backend.repository;

import com.nirva.backend.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

}