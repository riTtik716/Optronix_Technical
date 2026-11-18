package com.optronix.salesmgmt.modules.followup.controller;

import com.optronix.salesmgmt.modules.auth.entity.Role;
import com.optronix.salesmgmt.modules.auth.security.CustomUserDetails;
import com.optronix.salesmgmt.modules.followup.dto.CreateFollowUpRequest;
import com.optronix.salesmgmt.modules.followup.dto.FollowUpDto;
import com.optronix.salesmgmt.modules.followup.entity.FollowUpStatus;
import com.optronix.salesmgmt.modules.followup.service.FollowUpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow-ups")
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    @PostMapping
    public ResponseEntity<FollowUpDto> createFollowUp(@Valid @RequestBody CreateFollowUpRequest request,
                                                      @AuthenticationPrincipal CustomUserDetails userDetails) {
        FollowUpDto dto = followUpService.createFollowUp(request, userDetails.getUsername());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FollowUpDto>> getFollowUps(
            @RequestParam(required = false) Long meetingId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isManager = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_SALES_MANAGER.name()) ||
                               a.getAuthority().equals(Role.ROLE_ADMIN.name()) ||
                               a.getAuthority().equals("ROLE_SALES_MANAGER") ||
                               a.getAuthority().equals("ROLE_ADMIN"));
        List<FollowUpDto> list = followUpService.getFollowUps(meetingId, userDetails.getUsername(), isManager);
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FollowUpDto> updateStatus(@PathVariable Long id,
                                                    @RequestBody Map<String, String> body,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        FollowUpStatus status = FollowUpStatus.valueOf(body.get("status"));
        FollowUpDto updated = followUpService.updateStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<FollowUpDto> completeFollowUp(@PathVariable Long id,
                                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        FollowUpDto updated = followUpService.updateStatus(id, FollowUpStatus.COMPLETED, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<FollowUpDto> completeFollowUpPost(@PathVariable Long id,
                                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FollowUpDto updated = followUpService.updateStatus(id, FollowUpStatus.COMPLETED, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }
}
