package com.optronix.salesmgmt.modules.meeting.dto;

import java.time.LocalDateTime;

public class MeetingSessionDto {

    private Long id;
    private Integer sessionNumber;
    private LocalDateTime checkInTime;
    private Double checkInLatitude;
    private Double checkInLongitude;
    private String checkInLocationName;
    private LocalDateTime checkOutTime;
    private Double checkOutLatitude;
    private Double checkOutLongitude;
    private String checkOutLocationName;
    private String sessionNotes;
    private Long durationMinutes;

    public MeetingSessionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Long durationMinutes) { this.durationMinutes = durationMinutes; }
}
