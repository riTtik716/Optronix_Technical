package com.optronix.salesmgmt.modules.meeting.dto;

import com.optronix.salesmgmt.modules.meeting.entity.MeetingStatus;
import java.time.LocalDateTime;

public class MeetingAuditLogDto {

    private Long id;
    private MeetingStatus fromStatus;
    private MeetingStatus toStatus;
    private String action;
    private String performedBy;
    private LocalDateTime performedAt;
    private String reason;

    public MeetingAuditLogDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MeetingStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(MeetingStatus fromStatus) { this.fromStatus = fromStatus; }

    public MeetingStatus getToStatus() { return toStatus; }
    public void setToStatus(MeetingStatus toStatus) { this.toStatus = toStatus; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
