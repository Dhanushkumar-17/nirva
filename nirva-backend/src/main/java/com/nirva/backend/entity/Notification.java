package com.nirva.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 500)
    private String message;

    private String type;

    private boolean readStatus;

    private String createdAt;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Notification() {
    }


    // ==========================================
    // ID
    // ==========================================

    public Long getId() {
        return id;
    }


    // ==========================================
    // TITLE
    // ==========================================

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    // ==========================================
    // MESSAGE
    // ==========================================

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    // ==========================================
    // TYPE
    // ==========================================

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    // ==========================================
    // READ STATUS
    // ==========================================

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }


    // ==========================================
    // CREATED AT
    // ==========================================

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}