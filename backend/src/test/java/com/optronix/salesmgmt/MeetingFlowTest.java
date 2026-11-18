package com.optronix.salesmgmt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.optronix.salesmgmt.modules.auth.dto.LoginRequest;
import com.optronix.salesmgmt.modules.customer.entity.Customer;
import com.optronix.salesmgmt.modules.customer.repository.CustomerRepository;
import com.optronix.salesmgmt.modules.followup.repository.FollowUpRepository;
import com.optronix.salesmgmt.modules.meeting.dto.*;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingOutcome;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingAuditLogRepository;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingRepository;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MeetingFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private MeetingSessionRepository sessionRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private MeetingAuditLogRepository auditLogRepository;

    private String employeeToken;
    private String managerToken;

    @BeforeEach
    void setUpTokens() throws Exception {
        MvcResult empRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("employee@optronix.com", "password123"))))
                .andExpect(status().isOk())
                .andReturn();
        employeeToken = objectMapper.readTree(empRes.getResponse().getContentAsString()).get("accessToken").asText();

        MvcResult mgrRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("manager@optronix.com", "password123"))))
                .andExpect(status().isOk())
                .andReturn();
        managerToken = objectMapper.readTree(mgrRes.getResponse().getContentAsString()).get("accessToken").asText();
    }

    @Test
    void testStandardMeetingLifecycle() throws Exception {
        Customer customer = customerRepository.findAll().get(0);
        LocalDateTime start = LocalDateTime.now().plusDays(2).withHour(10).withMinute(0);

        CreateMeetingRequest req = new CreateMeetingRequest(
                customer.getId(), 3L, "Product Architecture Demo", start, start.plusHours(1), "Customer Site", null
        );

        MvcResult res = mockMvc.perform(post("/api/meetings")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SCHEDULED"))
                .andReturn();

        Long id = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(patch("/api/meetings/" + id + "/confirm")
                        .header("Authorization", "Bearer " + employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));

        mockMvc.perform(post("/api/meetings/" + id + "/check-in")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CheckInRequest(42.36, -71.05, "Site Gate", "On site"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CHECKED_IN"));

        mockMvc.perform(patch("/api/meetings/" + id + "/start")
                        .header("Authorization", "Bearer " + employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        CompleteMeetingRequest compReq = new CompleteMeetingRequest(
                MeetingOutcome.INTERESTED, "Interested in quote", null, null, null, 42.36, -71.05, "Site Gate"
        );

        mockMvc.perform(post("/api/meetings/" + id + "/complete")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(compReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void testOpenEndedMultiSessionVisitScenario() throws Exception {
        Customer customer = customerRepository.findAll().get(0);
        LocalDateTime start = LocalDateTime.now().withHour(10).withMinute(0);

        CreateMeetingRequest req = new CreateMeetingRequest(
                customer.getId(), 3L, "Field Visit", start, start.plusHours(1), "Client Plant", null
        );

        MvcResult res = mockMvc.perform(post("/api/meetings")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Long id = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();

        // 10:02 AM Session 1 Check-In
        mockMvc.perform(post("/api/meetings/" + id + "/check-in")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CheckInRequest(41.87, -87.62, "Plant Gate", "10:02 AM"))))
                .andExpect(status().isOk());

        // 10:40 AM Pause
        mockMvc.perform(post("/api/meetings/" + id + "/pause")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CheckOutRequest(41.87, -87.62, "Plant Gate", "Return at 3:00 PM"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));

        // 3:10 PM Resume Session 2
        mockMvc.perform(post("/api/meetings/" + id + "/resume")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CheckInRequest(41.87, -87.62, "Plant Gate", "3:10 PM"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessions.length()").value(2));

        // 4:00 PM Complete
        CompleteMeetingRequest comp = new CompleteMeetingRequest(
                MeetingOutcome.PROPOSAL_REQUESTED, "Requested proposal", null, null, null, 41.87, -87.62, "Plant Gate"
        );
        mockMvc.perform(post("/api/meetings/" + id + "/complete")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(comp)))
                .andExpect(status().isOk());

        var sessions = sessionRepository.findByMeetingIdOrderBySessionNumberAsc(id);
        assertThat(sessions).hasSize(2);
        assertThat(sessions.get(0).getCheckOutTime()).isNotNull();
        assertThat(sessions.get(1).getCheckOutTime()).isNotNull();
    }

    @Test
    void testFollowUpMandatoryValidation() throws Exception {
        Customer customer = customerRepository.findAll().get(0);
        LocalDateTime start = LocalDateTime.now().withHour(16).withMinute(0);

        CreateMeetingRequest req = new CreateMeetingRequest(
                customer.getId(), 3L, "Pricing Review", start, start.plusHours(1), "Online", null
        );
        MvcResult res = mockMvc.perform(post("/api/meetings")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/meetings/" + id + "/check-in")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CheckInRequest(null, null, null, null))))
                .andExpect(status().isOk());

        // Without details -> Bad Request
        CompleteMeetingRequest badReq = new CompleteMeetingRequest(
                MeetingOutcome.FOLLOW_UP_REQUIRED, "Need follow up", null, null, null, null, null, null
        );
        mockMvc.perform(post("/api/meetings/" + id + "/complete")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badReq)))
                .andExpect(status().isBadRequest());

        // With details -> Success and creates FollowUp entity
        CompleteMeetingRequest okReq = new CompleteMeetingRequest(
                MeetingOutcome.FOLLOW_UP_REQUIRED, "Need follow up", "Send proposal", LocalDate.now().plusDays(2), 3L, null, null, null
        );
        mockMvc.perform(post("/api/meetings/" + id + "/complete")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(okReq)))
                .andExpect(status().isOk());

        assertThat(followUpRepository.findByMeetingId(id)).hasSize(1);
    }

    @Test
    void testManagerOnlyReopenWithAudit() throws Exception {
        Long completedMeetingId = 2L;
        ReopenMeetingRequest req = new ReopenMeetingRequest("Customer requested secondary meeting");

        // Employee cannot reopen -> 403
        mockMvc.perform(post("/api/meetings/" + completedMeetingId + "/reopen")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());

        // Manager can reopen -> 200
        mockMvc.perform(post("/api/meetings/" + completedMeetingId + "/reopen")
                        .header("Authorization", "Bearer " + managerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REOPENED"));

        var logs = auditLogRepository.findByMeetingIdOrderByTimestampDesc(completedMeetingId);
        assertThat(logs).isNotEmpty();
        assertThat(logs.get(0).getAction()).isEqualTo("REOPEN_MEETING");
    }
}
