package com.optronix.salesmgmt.modules.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequest(
        @NotBlank(message = "Company name is required")
        @Size(max = 150)
        String companyName,

        @NotBlank(message = "Contact person is required")
        @Size(max = 100)
        String contactPerson,

        String contactEmail,
        String contactPhone,
        String address
) {}
