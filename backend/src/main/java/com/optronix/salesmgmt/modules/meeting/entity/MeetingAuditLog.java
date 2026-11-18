package com.optronix.salesmgmt.modules.meeting.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.optronix.salesmgmt.modules.auth.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_audit_logs")
public class MeetingAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    @JsonBackReference
    private Meeting meeting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id", nullable = false)
    private User performedBy;

    @Column(name = "action", nullable = false)
    private String action;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    private MeetingStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status")
    private MeetingStatus newStatus;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public MeetingAuditLog() {}

    public MeetingAuditLog(Meeting meeting, User performedBy, String action,
                           MeetingStatus previousStatus, MeetingStatus newStatus,
                           String reason, LocalDateTime timestamp) {
        this.meeting = meeting;
        this.performedBy = performedBy;
        this.action = action;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.reason = reason;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Meeting getMeeting() { return meeting; }
    public void setMeeting(Meeting meeting) { this.meeting = meeting; }

    public User getPerformedBy() { return performedBy; }
    public void setPerformedBy(User performedBy) { this.performedBy = performedBy; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public MeetingStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(MeetingStatus previousStatus) { this.previousStatus = previousStatus; }

    public MeetingStatus getNewStatus() { return newStatus; }
    public void setNewStatus(MeetingStatus newStatus) { this.newStatus = newStatus; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
