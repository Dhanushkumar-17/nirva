package com.nirva.backend.entity;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromLocation;

    private String toLocation;

    private String duration;

    private Integer cost;

    private String walking;

    private Integer changes;

    @ElementCollection
    @CollectionTable(
        name = "trip_transport",
        joinColumns = @JoinColumn(name = "trip_id")
    )
    @Column(name = "transport")
    private List<String> transport;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Trip() {
    }


    // ==========================================
    // ID
    // ==========================================

    public Long getId() {
        return id;
    }


    // ==========================================
    // FROM LOCATION
    // ==========================================

    public String getFromLocation() {
        return fromLocation;
    }

    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }


    // ==========================================
    // TO LOCATION
    // ==========================================

    public String getToLocation() {
        return toLocation;
    }

    public void setToLocation(String toLocation) {
        this.toLocation = toLocation;
    }


    // ==========================================
    // DURATION
    // ==========================================

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }


    // ==========================================
    // COST
    // ==========================================

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }


    // ==========================================
    // WALKING
    // ==========================================

    public String getWalking() {
        return walking;
    }

    public void setWalking(String walking) {
        this.walking = walking;
    }


    // ==========================================
    // CHANGES
    // ==========================================

    public Integer getChanges() {
        return changes;
    }

    public void setChanges(Integer changes) {
        this.changes = changes;
    }


    // ==========================================
    // TRANSPORT
    // ==========================================

    public List<String> getTransport() {
        return transport;
    }

    public void setTransport(List<String> transport) {
        this.transport = transport;
    }
}