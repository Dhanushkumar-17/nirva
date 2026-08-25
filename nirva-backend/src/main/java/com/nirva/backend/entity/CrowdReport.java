package com.nirva.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crowd_reports")
public class CrowdReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transport;
    private String location;
    private String crowdLevel;

    public CrowdReport() {
    }

    public Long getId() {
        return id;
    }

    public String getTransport() {
        return transport;
    }

    public void setTransport(String transport) {
        this.transport = transport;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(String crowdLevel) {
        this.crowdLevel = crowdLevel;
    }
}