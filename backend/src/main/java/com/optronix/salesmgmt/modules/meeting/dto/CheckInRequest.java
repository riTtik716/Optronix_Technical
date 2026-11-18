package com.optronix.salesmgmt.modules.meeting.dto;

public class CheckInRequest {

    private Double latitude;
    private Double longitude;
    private String locationName;
    private String notes;

    public CheckInRequest() {}

    public CheckInRequest(Double latitude, Double longitude, String locationName, String notes) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationName = locationName;
        this.notes = notes;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
