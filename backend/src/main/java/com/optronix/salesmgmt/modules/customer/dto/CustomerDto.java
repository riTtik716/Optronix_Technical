package com.optronix.salesmgmt.modules.customer.dto;

import com.optronix.salesmgmt.modules.customer.entity.Customer;

public record CustomerDto(
        Long id,
        String companyName,
        String contactPerson,
        String contactEmail,
        String contactPhone,
        String address
) {
    public static CustomerDto fromEntity(Customer c) {
        return new CustomerDto(
                c.getId(),
                c.getCompanyName(),
                c.getContactPerson(),
                c.getContactEmail(),
                c.getContactPhone(),
                c.getAddress()
        );
    }
}
