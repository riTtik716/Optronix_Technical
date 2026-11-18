package com.optronix.salesmgmt.modules.meeting.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_sessions")
public class MeetingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    @JsonBackReference
    private Meeting meeting;

    @Column(name = "session_number", nullable = false)
    private Integer sessionNumber;

    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name = "check_in_latitude")
    private Double checkInLatitude;

    @Column(name = "check_in_longitude")
    private Double checkInLongitude;

    @Column(name = "check_in_location_name")
    private String checkInLocationName;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "check_out_latitude")
    private Double checkOutLatitude;

    @Column(name = "check_out_longitude")
    private Double checkOutLongitude;

    @Column(name = "check_out_location_name")
    private String checkOutLocationName;

    @Column(name = "session_notes", length = 500)
    private String sessionNotes;

    public MeetingSession() {}

    public MeetingSession(Meeting meeting, Integer sessionNumber, LocalDateTime checkInTime,
                          Double checkInLatitude, Double checkInLongitude, String checkInLocationName) {
        this.meeting = meeting;
        this.sessionNumber = sessionNumber;
        this.checkInTime = checkInTime;
        this.checkInLatitude = checkInLatitude;
        this.checkInLongitude = checkInLongitude;
        this.checkInLocationName = checkInLocationName;
    }

    public Long getId() { return id; }
    public Meeting getMeeting() { return meeting; }
    public void setMeeting(Meeting meeting) { this.meeting = meeting; }
    public Integer getSessionNumber() { return sessionNumber; }
    public void setSessionNumber(Integer sessionNumber) { this.sessionNumber = sessionNumber; }
    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
    public Double getCheckInLatitude() { return checkInLatitude; }
    public void setCheckInLatitude(Double checkInLatitude) { this.checkInLatitude = checkInLatitude; }
    public Double getCheckInLongitude() { return checkInLongitude; }
    public void setCheckInLongitude(Double checkInLongitude) { this.checkInLongitude = checkInLongitude; }
    public String getCheckInLocationName() { return checkInLocationName; }
    public void setCheckInLocationName(String checkInLocationName) { this.checkInLocationName = checkInLocationName; }
    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }
    public Double getCheckOutLatitude() { return checkOutLatitude; }
    public void setCheckOutLatitude(Double checkOutLatitude) { this.checkOutLatitude = checkOutLatitude; }
    public Double getCheckOutLongitude() { return checkOutLongitude; }
    public void setCheckOutLongitude(Double checkOutLongitude) { this.checkOutLongitude = checkOutLongitude; }
    public String getCheckOutLocationName() { return checkOutLocationName; }
    public void setCheckOutLocationName(String checkOutLocationName) { this.checkOutLocationName = checkOutLocationName; }
    public String getSessionNotes() { return sessionNotes; }
    public void setSessionNotes(String sessionNotes) { this.sessionNotes = sessionNotes; }
}
