package com.optronix.salesmgmt.modules.meeting.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.optronix.salesmgmt.modules.auth.entity.User;
import com.optronix.salesmgmt.modules.customer.entity.Customer;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_id", nullable = false)
    private User assignedEmployee;

    @Column(name = "purpose", nullable = false)
    private String purpose;

    @Column(name = "scheduled_start_time", nullable = false)
    private LocalDateTime scheduledStartTime;

    @Column(name = "scheduled_end_time", nullable = false)
    private LocalDateTime scheduledEndTime;

    @Column(name = "meeting_location", nullable = false)
    private String meetingLocation;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Lob
    @Column(name = "notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MeetingStatus status = MeetingStatus.SCHEDULED;

    @Enumerated(EnumType.STRING)
    @Column(name = "outcome")
    private MeetingOutcome outcome;

    @Lob
    @Column(name = "outcome_notes")
    private String outcomeNotes;

    @Column(name = "reopened_count")
    private Integer reopenedCount = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("sessionNumber ASC")
    private List<MeetingSession> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("timestamp DESC")
    private List<MeetingAuditLog> auditLogs = new ArrayList<>();

    public Meeting() {}

    public Meeting(Customer customer, User assignedEmployee, String purpose,
                   LocalDateTime scheduledStartTime, LocalDateTime scheduledEndTime,
                   String meetingLocation, String notes) {
        this.customer = customer;
        this.assignedEmployee = assignedEmployee;
        this.purpose = purpose;
        this.scheduledStartTime = scheduledStartTime;
        this.scheduledEndTime = scheduledEndTime;
        this.meetingLocation = meetingLocation;
        this.notes = notes;
        this.status = MeetingStatus.SCHEDULED;
        this.reopenedCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addSession(MeetingSession session) {
        sessions.add(session);
        session.setMeeting(this);
    }

    public void addAuditLog(MeetingAuditLog log) {
        auditLogs.add(log);
        log.setMeeting(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public User getAssignedEmployee() { return assignedEmployee; }
    public void setAssignedEmployee(User assignedEmployee) { this.assignedEmployee = assignedEmployee; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public LocalDateTime getScheduledStartTime() { return scheduledStartTime; }
    public void setScheduledStartTime(LocalDateTime scheduledStartTime) { this.scheduledStartTime = scheduledStartTime; }

    public LocalDateTime getScheduledEndTime() { return scheduledEndTime; }
    public void setScheduledEndTime(LocalDateTime scheduledEndTime) { this.scheduledEndTime = scheduledEndTime; }

    public String getMeetingLocation() { return meetingLocation; }
    public void setMeetingLocation(String meetingLocation) { this.meetingLocation = meetingLocation; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public MeetingStatus getStatus() { return status; }
    public void setStatus(MeetingStatus status) { this.status = status; }

    public MeetingOutcome getOutcome() { return outcome; }
    public void setOutcome(MeetingOutcome outcome) { this.outcome = outcome; }

    public String getOutcomeNotes() { return outcomeNotes; }
    public void setOutcomeNotes(String outcomeNotes) { this.outcomeNotes = outcomeNotes; }

    public Integer getReopenedCount() { return reopenedCount; }
    public void setReopenedCount(Integer reopenedCount) { this.reopenedCount = reopenedCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<MeetingSession> getSessions() { return sessions; }
    public void setSessions(List<MeetingSession> sessions) { this.sessions = sessions; }

    public List<MeetingAuditLog> getAuditLogs() { return auditLogs; }
    public void setAuditLogs(List<MeetingAuditLog> auditLogs) { this.auditLogs = auditLogs; }
}
