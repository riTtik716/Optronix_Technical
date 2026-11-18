package com.optronix.salesmgmt.modules.followup.service;

import com.optronix.salesmgmt.modules.followup.dto.CreateFollowUpRequest;
import com.optronix.salesmgmt.modules.followup.dto.FollowUpDto;
import com.optronix.salesmgmt.modules.followup.entity.FollowUpStatus;

import java.util.List;

public interface FollowUpService {

    FollowUpDto createFollowUp(CreateFollowUpRequest request, String currentUsername);

    List<FollowUpDto> getFollowUps(Long meetingId, String currentUsername, boolean isManager);

    FollowUpDto updateStatus(Long id, FollowUpStatus newStatus, String currentUsername);
}
