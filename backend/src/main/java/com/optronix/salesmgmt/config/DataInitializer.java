package com.optronix.salesmgmt.config;

import com.optronix.salesmgmt.modules.auth.entity.Role;
import com.optronix.salesmgmt.modules.auth.entity.User;
import com.optronix.salesmgmt.modules.auth.entity.UserActivityLog;
import com.optronix.salesmgmt.modules.auth.repository.UserActivityLogRepository;
import com.optronix.salesmgmt.modules.auth.repository.UserRepository;
import com.optronix.salesmgmt.modules.customer.entity.Customer;
import com.optronix.salesmgmt.modules.customer.repository.CustomerRepository;
import com.optronix.salesmgmt.modules.followup.entity.FollowUp;
import com.optronix.salesmgmt.modules.followup.repository.FollowUpRepository;
import com.optronix.salesmgmt.modules.meeting.entity.*;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingAuditLogRepository;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingRepository;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            MeetingRepository meetingRepository,
            MeetingSessionRepository sessionRepository,
            MeetingAuditLogRepository auditLogRepository,
            FollowUpRepository followUpRepository,
            UserActivityLogRepository userActivityLogRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                logger.info("Initializing Enterprise Sales Production Dataset with Complete Real Data...");

                LocalDateTime now = LocalDateTime.now();

                // 1. System Administrator
                User admin = new User(
                        "Marcus Sterling (System Admin)",
                        "admin@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_ADMIN,
                        null
                );
                admin.setLastLoginAt(now.minusHours(1).minusMinutes(12));
                User savedAdmin = userRepository.save(admin);

                // 2. Sales Managers
                User managerSarah = new User(
                        "Sarah Jenkins (VP Enterprise Sales)",
                        "manager@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_SALES_MANAGER,
                        null
                );
                managerSarah.setLastLoginAt(now.minusMinutes(24));
                User savedManagerSarah = userRepository.save(managerSarah);

                User managerRobert = new User(
                        "Robert Chen (Director Strategic Accounts)",
                        "robert@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_SALES_MANAGER,
                        null
                );
                managerRobert.setLastLoginAt(now.minusHours(3));
                User savedManagerRobert = userRepository.save(managerRobert);

                // 3. Sales Representatives (reporting to Sarah Jenkins)
                User repAlex = new User(
                        "Alex Rivera (Senior Account Executive)",
                        "employee@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_SALES_EMPLOYEE,
                        savedManagerSarah.getId()
                );
                repAlex.setLastLoginAt(now.minusMinutes(45));
                User savedRepAlex = userRepository.save(repAlex);

                User repDavid = new User(
                        "David Chen (Enterprise Account Specialist)",
                        "david@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_SALES_EMPLOYEE,
                        savedManagerSarah.getId()
                );
                repDavid.setLastLoginAt(now.minusHours(2).minusMinutes(10));
                User savedRepDavid = userRepository.save(repDavid);

                // 4. Sales Representatives (reporting to Robert Chen)
                User repPriya = new User(
                        "Priya Sharma (Strategic Accounts Director)",
                        "priya@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_SALES_EMPLOYEE,
                        savedManagerRobert.getId()
                );
                repPriya.setLastLoginAt(now.minusHours(4));
                User savedRepPriya = userRepository.save(repPriya);

                User repMarcus = new User(
                        "Marcus Vance (Cloud Solutions Consultant)",
                        "marcus@optronix.com",
                        passwordEncoder.encode("password123"),
                        Role.ROLE_SALES_EMPLOYEE,
                        savedManagerRobert.getId()
                );
                repMarcus.setLastLoginAt(now.minusHours(5));
                User savedRepMarcus = userRepository.save(repMarcus);

                logger.info("Successfully seeded 1 Admin, 2 Managers, and 4 Sales Representatives.");

                // 5. Seed Enterprise Customers
                Customer c1 = customerRepository.save(new Customer(
                        "Siemens Healthineers",
                        "Dr. Thomas Becker (Chief Medical Tech Officer)",
                        "t.becker@siemens-healthineers.com",
                        "+1 (617) 555-0182",
                        "400 Commonwealth Ave, Boston, MA 02215"
                ));

                Customer c2 = customerRepository.save(new Customer(
                        "Schneider Electric",
                        "Mark Van Der Bilt (VP Global Grid Infrastructure)",
                        "mark.vanderbilt@se.com",
                        "+1 (312) 555-0144",
                        "200 N LaSalle St, Suite 1800, Chicago, IL 60601"
                ));

                Customer c3 = customerRepository.save(new Customer(
                        "Novartis Pharmaceuticals",
                        "Clara Dubois (Global Procurement Director)",
                        "clara.dubois@novartis.com",
                        "+1 (862) 555-0199",
                        "One Health Plaza, East Hanover, NJ 07936"
                ));

                Customer c4 = customerRepository.save(new Customer(
                        "Infosys Technologies",
                        "Rajesh Sundaram (VP Cloud & AI Operations)",
                        "rajesh.sundaram@infosys.com",
                        "+1 (408) 555-0177",
                        "3300 Hillview Ave, Building 4, Palo Alto, CA 94304"
                ));

                Customer c5 = customerRepository.save(new Customer(
                        "Stripe Financial Corp",
                        "Maya Lin (Head of Enterprise Infrastructure)",
                        "maya.lin@stripe.com",
                        "+1 (415) 555-0128",
                        "510 Townsend St, San Francisco, CA 94103"
                ));

                Customer c6 = customerRepository.save(new Customer(
                        "Boeing Aerospace & Defense",
                        "James C. Holloway (VP Supply Chain Systems)",
                        "james.holloway@boeing.com",
                        "+1 (312) 555-0160",
                        "100 N Riverside Plaza, Chicago, IL 60606"
                ));

                Customer c7 = customerRepository.save(new Customer(
                        "Delta Air Lines Enterprise",
                        "Rachel Vance (Director Fleet Operations)",
                        "rachel.vance@delta.com",
                        "+1 (404) 555-0133",
                        "1030 Delta Blvd, Atlanta, GA 30354"
                ));

                Customer c8 = customerRepository.save(new Customer(
                        "Target Retail Corporation",
                        "Kenneth O'Connor (VP Logistics & Distribution)",
                        "k.oconnor@target.com",
                        "+1 (612) 555-0112",
                        "1000 Nicollet Mall, Minneapolis, MN 55403"
                ));

                logger.info("Successfully seeded 8 Enterprise Customer Accounts.");

                // 6. Seed Meetings Across Reps, Managers, and Lifecycles
                // Ensuring all 5 outcomes (INTERESTED, FOLLOW_UP_REQUIRED, PROPOSAL_REQUESTED, NOT_INTERESTED, UNABLE_TO_MEET)
                // are populated with non-zero real data for Rep Alex, Manager Sarah's team, and Admin global scope.

                // =========================================================================
                // --- REP 1: ALEX RIVERA (under Sarah Jenkins) ---
                // =========================================================================

                // M1: In Progress Today (Started 35 min ago)
                Meeting m1 = new Meeting(
                        c1, savedRepAlex,
                        "Enterprise Medical Telemetry Architecture Demo",
                        now.minusMinutes(35), now.plusMinutes(25),
                        "Siemens Healthineers - Innovation Center, Boston",
                        "Live telemetry streaming architecture demonstration with clinical engineering team."
                );
                m1.setMeetingLink("https://meet.google.com/sie-tele-demo");
                m1.setStatus(MeetingStatus.IN_PROGRESS);
                Meeting savedM1 = meetingRepository.save(m1);
                sessionRepository.save(new MeetingSession(
                        savedM1, 1, now.minusMinutes(35),
                        42.3496, -71.0997, "Siemens Main Reception, Boston"
                ));

                // M2: Confirmed Today (Afternoon at 2:00 PM)
                Meeting m2 = new Meeting(
                        c2, savedRepAlex,
                        "Smart Grid Automation Platform Security Review",
                        now.withHour(14).withMinute(0), now.withHour(15).withMinute(30),
                        "Schneider Electric - Chicago Innovation Hub",
                        "Security compliance, encryption in transit, and ISO-27001 audit requirements."
                );
                m2.setMeetingLink("https://meet.google.com/sch-grid-sec");
                m2.setStatus(MeetingStatus.CONFIRMED);
                meetingRepository.save(m2);

                // M3: Scheduled Today (Late afternoon at 4:30 PM)
                Meeting m3 = new Meeting(
                        c5, savedRepAlex,
                        "Payment Gateway Telemetry Ingestion Architecture",
                        now.withHour(16).withMinute(30), now.withHour(17).withMinute(30),
                        "Stripe Financial Corp - San Francisco HQ",
                        "Discussion on low-latency streaming pipeline for global transaction settlement monitoring."
                );
                m3.setMeetingLink("https://meet.google.com/str-pay-arch");
                m3.setStatus(MeetingStatus.SCHEDULED);
                meetingRepository.save(m3);

                // M4: DELIBERATELY OPEN-ENDED INTERVIEW SCENARIO (Today)
                // "A salesperson checks into a customer meeting at 10:02 AM. The meeting was scheduled for 10:00–11:00 AM.
                // At 10:40 AM, the customer asks them to return at 3:00 PM instead. The salesperson returns at 3:10 PM and completes at 4:00 PM."
                Meeting mScenario = new Meeting(
                        c8, savedRepAlex,
                        "Omnichannel DC Robotic Automation Deployment",
                        now.withHour(10).withMinute(0), now.withHour(11).withMinute(0),
                        "Target Logistics Fulfillment Center, Minneapolis",
                        "Real-world split session scenario: initial briefing interrupted by fire drill, resumed at 3:10 PM."
                );
                mScenario.setStatus(MeetingStatus.COMPLETED);
                mScenario.setOutcome(MeetingOutcome.PROPOSAL_REQUESTED);
                mScenario.setOutcomeNotes("Customer VP requested full enterprise proposal for 8 regional distribution centers. High confidence deal.");
                Meeting savedMScenario = meetingRepository.save(mScenario);
                // Session 1: 10:02 AM to 10:40 AM (38 mins)
                MeetingSession s1 = new MeetingSession(
                        savedMScenario, 1,
                        now.withHour(10).withMinute(2),
                        44.9740, -93.2777, "Target HQ Building A - West Visitor Entrance"
                );
                s1.setCheckOutTime(now.withHour(10).withMinute(40));
                s1.setCheckOutLatitude(44.9741);
                s1.setCheckOutLongitude(-93.2778);
                s1.setCheckOutLocationName("Target HQ West Security Gate");
                s1.setSessionNotes("Customer had warehouse shift briefing; asked to return at 3:00 PM");
                sessionRepository.save(s1);
                // Session 2: Resumed at 3:10 PM to 4:00 PM (50 mins)
                MeetingSession s2 = new MeetingSession(
                        savedMScenario, 2,
                        now.withHour(15).withMinute(10),
                        44.9742, -93.2776, "Target Engineering Conference Room 4B"
                );
                s2.setCheckOutTime(now.withHour(16).withMinute(0));
                s2.setCheckOutLatitude(44.9742);
                s2.setCheckOutLongitude(-93.2776);
                s2.setCheckOutLocationName("Target Engineering Conference Room 4B");
                s2.setSessionNotes("Completed technical demo with VP Logistics and operations team");
                sessionRepository.save(s2);
                auditLogRepository.save(new MeetingAuditLog(
                        savedMScenario, savedRepAlex, "PAUSE_SESSION",
                        MeetingStatus.IN_PROGRESS, MeetingStatus.IN_PROGRESS,
                        "Customer requested split session return at 3:00 PM due to warehouse shift briefing.",
                        now.withHour(10).withMinute(40)
                ));
                auditLogRepository.save(new MeetingAuditLog(
                        savedMScenario, savedRepAlex, "RESUME_SESSION",
                        MeetingStatus.IN_PROGRESS, MeetingStatus.IN_PROGRESS,
                        "Returned at 3:10 PM to conclude technical evaluation.",
                        now.withHour(15).withMinute(10)
                ));

                // M5: Completed Today morning - INTERESTED
                Meeting m5 = new Meeting(
                        c1, savedRepAlex,
                        "Diagnostic Imaging AI Workflow Integration",
                        now.withHour(8).withMinute(30), now.withHour(9).withMinute(45),
                        "Siemens Healthineers - Remote Video Room",
                        "CT scan reconstruction streaming benchmarks review."
                );
                m5.setMeetingLink("https://meet.google.com/sie-diag-ai");
                m5.setStatus(MeetingStatus.COMPLETED);
                m5.setOutcome(MeetingOutcome.INTERESTED);
                m5.setOutcomeNotes("Dr. Becker confirmed strong clinical interest. Requested technical deep-dive with radiologists.");
                meetingRepository.save(m5);

                // M6: Completed Yesterday (1 day ago) - FOLLOW_UP_REQUIRED
                Meeting m6 = new Meeting(
                        c4, savedRepAlex,
                        "Q3 Cloud Migration & Compliance Review",
                        now.minusDays(1).withHour(11).withMinute(0),
                        now.minusDays(1).withHour(12).withMinute(30),
                        "Infosys Technologies - Palo Alto Campus",
                        "Final review of multi-cloud workload migration benchmarks."
                );
                m6.setStatus(MeetingStatus.COMPLETED);
                m6.setOutcome(MeetingOutcome.FOLLOW_UP_REQUIRED);
                m6.setOutcomeNotes("Client approved pilot scope. Requested finalized multi-year SLA matrix and SOC-2 questionnaire.");
                Meeting savedM6 = meetingRepository.save(m6);
                followUpRepository.save(new FollowUp(
                        savedM6, savedRepAlex,
                        "Submit revised multi-year SLA matrix and SOC-2 questionnaire for Infosys",
                        LocalDate.now().plusDays(2),
                        "High priority: procurement lead requires signed SLA before Friday budget committee."
                ));

                // M7: Completed 2 days ago - INTERESTED
                Meeting m7 = new Meeting(
                        c6, savedRepAlex,
                        "Avionics Real-Time Telemetry Kafka Bus",
                        now.minusDays(2).withHour(13).withMinute(0),
                        now.minusDays(2).withHour(14).withMinute(30),
                        "Boeing Aerospace - Chicago Corporate Center",
                        "Demonstrated sub-10ms Kafka ingestion for turbine telemetry."
                );
                m7.setStatus(MeetingStatus.COMPLETED);
                m7.setOutcome(MeetingOutcome.INTERESTED);
                m7.setOutcomeNotes("Aviation engineering leadership enthusiastic about latency benchmarks and failover cluster.");
                meetingRepository.save(m7);

                // M8: Completed 3 days ago - PROPOSAL_REQUESTED
                Meeting m8 = new Meeting(
                        c8, savedRepAlex,
                        "Distribution Center IoT Tracking Hardware Pilot",
                        now.minusDays(3).withHour(14).withMinute(0),
                        now.minusDays(3).withHour(15).withMinute(15),
                        "Target Corp - Minneapolis Headquarters",
                        "Demonstrated RFID + BLE sensor tags for high-throughput fulfillment centers."
                );
                m8.setStatus(MeetingStatus.COMPLETED);
                m8.setOutcome(MeetingOutcome.PROPOSAL_REQUESTED);
                m8.setOutcomeNotes("Requested full commercial proposal for 12 regional distribution facilities.");
                meetingRepository.save(m8);

                // M9: Completed 5 days ago - FOLLOW_UP_REQUIRED
                Meeting m9 = new Meeting(
                        c2, savedRepAlex,
                        "Substation Energy Metering API Integration",
                        now.minusDays(5).withHour(10).withMinute(0),
                        now.minusDays(5).withHour(11).withMinute(30),
                        "Schneider Electric - Chicago Innovation Hub",
                        "Reviewed REST API specs for IoT smart electrical meters."
                );
                m9.setStatus(MeetingStatus.COMPLETED);
                m9.setOutcome(MeetingOutcome.FOLLOW_UP_REQUIRED);
                m9.setOutcomeNotes("Schneider engineering team requested customized OpenAPI 3.0 specs and sandbox API keys.");
                Meeting savedM9 = meetingRepository.save(m9);
                followUpRepository.save(new FollowUp(
                        savedM9, savedRepAlex,
                        "Provide sandbox API keys & OpenAPI 3.0 documentation to Schneider lead architect",
                        LocalDate.now().plusDays(3),
                        "Deliver via secure developer portal."
                ));

                // M10: Completed 10 days ago (Week 2 of Last Month) - NOT_INTERESTED
                Meeting m10 = new Meeting(
                        c7, savedRepAlex,
                        "In-Flight Entertainment Connectivity Telemetry",
                        now.minusDays(10).withHour(15).withMinute(0),
                        now.minusDays(10).withHour(16).withMinute(0),
                        "Delta Air Lines Enterprise - Atlanta HQ",
                        "Presentation on satellite link failover telemetry."
                );
                m10.setStatus(MeetingStatus.COMPLETED);
                m10.setOutcome(MeetingOutcome.NOT_INTERESTED);
                m10.setOutcomeNotes("Delta already committed to existing vendor contract for the next 3 fiscal years.");
                meetingRepository.save(m10);

                // M11: Completed 18 days ago (Week 3 of Last Month) - UNABLE_TO_MEET
                Meeting m11 = new Meeting(
                        c3, savedRepAlex,
                        "Cold-Chain Vaccine Logistics Sensor Protocol",
                        now.minusDays(18).withHour(11).withMinute(0),
                        now.minusDays(18).withHour(12).withMinute(0),
                        "Novartis Pharmaceuticals - East Hanover Plaza",
                        "Discussion on automated temperature excursion alerts."
                );
                m11.setStatus(MeetingStatus.COMPLETED);
                m11.setOutcome(MeetingOutcome.UNABLE_TO_MEET);
                m11.setOutcomeNotes("Customer facility was placed under urgent FDA regulatory quarantine audit; meeting could not proceed.");
                meetingRepository.save(m11);

                // M12: Completed 24 days ago (Week 4 of Last Month) - INTERESTED
                Meeting m12 = new Meeting(
                        c5, savedRepAlex,
                        "Global Core Banking Event Streaming Audit",
                        now.minusDays(24).withHour(14).withMinute(0),
                        now.minusDays(24).withHour(15).withMinute(30),
                        "Stripe Financial Corp - San Francisco HQ",
                        "Executive briefing on PCI-DSS certified immutable logging."
                );
                m12.setStatus(MeetingStatus.COMPLETED);
                m12.setOutcome(MeetingOutcome.INTERESTED);
                m12.setOutcomeNotes("Infrastructure VP approved technical requirements document. Moving to proof-of-concept phase.");
                meetingRepository.save(m12);

                // =========================================================================
                // --- REP 2: DAVID CHEN (under Sarah Jenkins) ---
                // =========================================================================

                // M13: In Progress Today (Started 20 min ago)
                Meeting m13 = new Meeting(
                        c8, savedRepDavid,
                        "Omnichannel Warehouse Automation & Robotics Review",
                        now.minusMinutes(20), now.plusMinutes(40),
                        "Target Logistics Center, Minneapolis",
                        "Evaluating real-time automated robotic picking system integrations."
                );
                m13.setMeetingLink("https://meet.google.com/tgt-auto-rob");
                m13.setStatus(MeetingStatus.IN_PROGRESS);
                Meeting savedM13 = meetingRepository.save(m13);
                sessionRepository.save(new MeetingSession(
                        savedM13, 1, now.minusMinutes(20),
                        44.9740, -93.2777, "Target HQ Building A, Security Desk"
                ));

                // M14: Scheduled Tomorrow
                Meeting m14 = new Meeting(
                        c7, savedRepDavid,
                        "Fleet Logistics Route Optimization Review",
                        now.plusDays(1).withHour(14).withMinute(0),
                        now.plusDays(1).withHour(15).withMinute(0),
                        "Delta Air Lines Enterprise - Atlanta HQ",
                        "Demonstrating predictive fuel consumption analytics and routing software."
                );
                m14.setMeetingLink("https://meet.google.com/dal-fleet-opt");
                m14.setStatus(MeetingStatus.SCHEDULED);
                meetingRepository.save(m14);

                // M15: Completed 1 day ago - FOLLOW_UP_REQUIRED
                Meeting m15 = new Meeting(
                        c1, savedRepDavid,
                        "Hospital Diagnostic Server High-Availability Cluster",
                        now.minusDays(1).withHour(15).withMinute(0),
                        now.minusDays(1).withHour(16).withMinute(15),
                        "Siemens Healthineers - Boston",
                        "Reviewed failover resilience and 99.999% uptime guarantees."
                );
                m15.setStatus(MeetingStatus.COMPLETED);
                m15.setOutcome(MeetingOutcome.FOLLOW_UP_REQUIRED);
                m15.setOutcomeNotes("Client wants formal proposal with 5-year hardware maintenance and 24/7 dedicated support.");
                Meeting savedM15 = meetingRepository.save(m15);
                followUpRepository.save(new FollowUp(
                        savedM15, savedRepDavid,
                        "Deliver formal 5-year maintenance contract & tiered SLA proposal for Siemens",
                        LocalDate.now().plusDays(4),
                        "Send to Dr. Becker and CC Siemens procurement team."
                ));

                // M16: Completed 3 days ago - INTERESTED
                Meeting m16 = new Meeting(
                        c3, savedRepDavid,
                        "Biotech Clinical Trial Data Vault Security",
                        now.minusDays(3).withHour(11).withMinute(0),
                        now.minusDays(3).withHour(12).withMinute(15),
                        "Novartis Pharmaceuticals - East Hanover Plaza",
                        "Encrypted data streaming for multi-site clinical trials."
                );
                m16.setStatus(MeetingStatus.COMPLETED);
                m16.setOutcome(MeetingOutcome.INTERESTED);
                m16.setOutcomeNotes("Novartis security board approved zero-knowledge architecture.");
                meetingRepository.save(m16);

                // M17: Completed 6 days ago - NOT_INTERESTED
                Meeting m17 = new Meeting(
                        c2, savedRepDavid,
                        "Legacy SCADA Replacement System",
                        now.minusDays(6).withHour(14).withMinute(0),
                        now.minusDays(6).withHour(15).withMinute(0),
                        "Schneider Electric - Chicago Facility",
                        "Presented gateway migration bridge."
                );
                m17.setStatus(MeetingStatus.COMPLETED);
                m17.setOutcome(MeetingOutcome.NOT_INTERESTED);
                m17.setOutcomeNotes("Schneider opted to retain legacy hardware until 2028 plant modernization cycle.");
                meetingRepository.save(m17);

                // M18: Completed 14 days ago (Week 2 of Last Month) - UNABLE_TO_MEET
                Meeting m18 = new Meeting(
                        c6, savedRepDavid,
                        "Aircraft Fuselage Vibration Sensor Field Test",
                        now.minusDays(14).withHour(10).withMinute(0),
                        now.minusDays(14).withHour(11).withMinute(0),
                        "Boeing Technology Center, Chicago",
                        "On-site runway testing demonstration."
                );
                m18.setStatus(MeetingStatus.COMPLETED);
                m18.setOutcome(MeetingOutcome.UNABLE_TO_MEET);
                m18.setOutcomeNotes("Severe blizzard grounded all test operations at runway facility; client rescheduled.");
                meetingRepository.save(m18);

                // =========================================================================
                // --- REP 3: PRIYA SHARMA (under Robert Chen) ---
                // =========================================================================

                // M19: Confirmed Today
                Meeting m19 = new Meeting(
                        c5, savedRepPriya,
                        "High-Throughput Transaction Ledger Audit System",
                        now.plusHours(1), now.plusHours(2).plusMinutes(15),
                        "Stripe Financial Corp - San Francisco HQ",
                        "Technical architecture discussion for low-latency transaction event streams."
                );
                m19.setMeetingLink("https://meet.google.com/str-tx-audit");
                m19.setStatus(MeetingStatus.CONFIRMED);
                meetingRepository.save(m19);

                // M20: Reopened by Manager
                Meeting m20 = new Meeting(
                        c3, savedRepPriya,
                        "Vaccine Cold-Chain Temperature Sensor Calibration",
                        now.minusDays(4).withHour(10).withMinute(0),
                        now.minusDays(4).withHour(11).withMinute(30),
                        "Novartis Biotech Testing Lab",
                        "Sensor calibration tolerances and real-time alert dispatching."
                );
                m20.setStatus(MeetingStatus.REOPENED);
                m20.setReopenedCount(1);
                m20.setOutcome(MeetingOutcome.INTERESTED);
                m20.setOutcomeNotes("Initial session was completed; reopened by Manager Robert Chen for executive contract scope revision.");
                Meeting savedM20 = meetingRepository.save(m20);
                auditLogRepository.save(new MeetingAuditLog(
                        savedM20, savedManagerRobert, "REOPEN_MEETING",
                        MeetingStatus.COMPLETED, MeetingStatus.REOPENED,
                        "Customer requested additional scope review for European clinical sites.",
                        now.minusDays(1)
                ));

                // M21: Completed 4 days ago - INTERESTED
                Meeting m21 = new Meeting(
                        c6, savedRepPriya,
                        "Aircraft Sensor Real-Time Data Pipeline Architecture",
                        now.minusDays(4).withHour(13).withMinute(0),
                        now.minusDays(4).withHour(14).withMinute(45),
                        "Boeing Aerospace - Chicago Corporate Center",
                        "Demonstrated sub-10ms Kafka ingestion for turbine telemetry."
                );
                m21.setStatus(MeetingStatus.COMPLETED);
                m21.setOutcome(MeetingOutcome.INTERESTED);
                m21.setOutcomeNotes("Aviation engineering leadership enthusiastic about latency benchmarks.");
                meetingRepository.save(m21);

                // M22: Completed 12 days ago - PROPOSAL_REQUESTED
                Meeting m22 = new Meeting(
                        c4, savedRepPriya,
                        "AI Automated Incident Remediation Platform",
                        now.minusDays(12).withHour(14).withMinute(0),
                        now.minusDays(12).withHour(15).withMinute(30),
                        "Infosys Technologies - Palo Alto Campus",
                        "Automated root cause analysis demonstration for cloud SRE teams."
                );
                m22.setStatus(MeetingStatus.COMPLETED);
                m22.setOutcome(MeetingOutcome.PROPOSAL_REQUESTED);
                m22.setOutcomeNotes("Infosys EVP requested proposal covering enterprise enterprise licensing for 5,000 developers.");
                meetingRepository.save(m22);

                // =========================================================================
                // --- REP 4: MARCUS VANCE (under Robert Chen) ---
                // =========================================================================

                // M23: Checked In (Awaiting Start)
                Meeting m23 = new Meeting(
                        c6, savedRepMarcus,
                        "Aviation Component Traceability & Telemetry Deployment",
                        now.minusMinutes(10), now.plusMinutes(50),
                        "Boeing Technology Center, Chicago",
                        "Reviewing manufacturing batch serialization and QR/RFID traceability."
                );
                m23.setMeetingLink("https://meet.google.com/boe-trace-tele");
                m23.setStatus(MeetingStatus.CHECKED_IN);
                Meeting savedM23 = meetingRepository.save(m23);
                sessionRepository.save(new MeetingSession(
                        savedM23, 1, now.minusMinutes(10),
                        41.8842, -87.6387, "Boeing Main Gate Visitor Reception"
                ));

                // M24: Completed 2 days ago - FOLLOW_UP_REQUIRED
                Meeting m24 = new Meeting(
                        c7, savedRepMarcus,
                        "Baggage Tracking Wireless Sensor Grid Pilot",
                        now.minusDays(2).withHour(14).withMinute(0),
                        now.minusDays(2).withHour(15).withMinute(30),
                        "Delta Air Lines - Terminal Tech Center",
                        "Proof of concept for long-range BLE beacon network in terminal basements."
                );
                m24.setStatus(MeetingStatus.COMPLETED);
                m24.setOutcome(MeetingOutcome.FOLLOW_UP_REQUIRED);
                m24.setOutcomeNotes("Pilot successful. Delta security officer requested SOC2 Type II audit certification.");
                Meeting savedM24 = meetingRepository.save(m24);
                followUpRepository.save(new FollowUp(
                        savedM24, savedRepMarcus,
                        "Provide certified SOC2 Type II audit report & disaster recovery SLA to Delta",
                        LocalDate.now().plusDays(5),
                        "Required by Delta CISO before moving to enterprise roll-out contract."
                ));

                // M25: Completed 7 days ago - NOT_INTERESTED
                Meeting m25 = new Meeting(
                        c2, savedRepMarcus,
                        "Substation Energy Efficiency Monitoring System",
                        now.minusDays(7).withHour(10).withMinute(0),
                        now.minusDays(7).withHour(11).withMinute(0),
                        "Schneider Electric - Chicago Facility",
                        "Presented wireless power metering clamps."
                );
                m25.setStatus(MeetingStatus.COMPLETED);
                m25.setOutcome(MeetingOutcome.NOT_INTERESTED);
                m25.setOutcomeNotes("Schneider already selected an in-house proprietary solution for this fiscal year.");
                meetingRepository.save(m25);

                // M26: Completed 21 days ago (Week 3 of Last Month) - UNABLE_TO_MEET
                Meeting m26 = new Meeting(
                        c1, savedRepMarcus,
                        "Mobile Ultrasound Tele-Health Streaming Protocol",
                        now.minusDays(21).withHour(15).withMinute(0),
                        now.minusDays(21).withHour(16).withMinute(0),
                        "Siemens Healthineers - Boston",
                        "Bandwidth adaptive protocol demo."
                );
                m26.setStatus(MeetingStatus.COMPLETED);
                m26.setOutcome(MeetingOutcome.UNABLE_TO_MEET);
                m26.setOutcomeNotes("Siemens technical contact was called into emergency surgery telemetry support.");
                meetingRepository.save(m26);

                logger.info("Successfully seeded 26 Realistic Enterprise Meetings, Multi-Session Check-ins, and Follow-ups with non-zero outcomes.");

                // 7. Seed Real User Activity Logs
                userActivityLogRepository.save(new UserActivityLog(
                        savedRepAlex, "LOGIN", "Alex Rivera logged into Sales Workspace", now.minusMinutes(45)
                ));
                userActivityLogRepository.save(new UserActivityLog(
                        savedManagerSarah, "LOGIN", "Sarah Jenkins opened Manager Executive Console", now.minusMinutes(24)
                ));
                userActivityLogRepository.save(new UserActivityLog(
                        savedAdmin, "LOGIN", "Marcus Sterling logged into System Administration Console", now.minusHours(1).minusMinutes(12)
                ));
                userActivityLogRepository.save(new UserActivityLog(
                        savedRepAlex, "CHECK_IN", "Alex Rivera checked in via GPS at Siemens Healthineers (42.3496, -71.0997)", now.minusMinutes(35)
                ));
                userActivityLogRepository.save(new UserActivityLog(
                        savedRepDavid, "CHECK_IN", "David Chen checked in via GPS at Target Corporation (44.9740, -93.2777)", now.minusMinutes(20)
                ));
                userActivityLogRepository.save(new UserActivityLog(
                        savedManagerRobert, "REOPEN_MEETING", "Robert Chen reopened Meeting #20 for Novartis Pharmaceuticals", now.minusDays(1)
                ));

                logger.info("Full Optronix Enterprise Real Dataset successfully seeded.");
            }
        };
    }
}
