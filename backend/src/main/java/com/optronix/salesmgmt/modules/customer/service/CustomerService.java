package com.optronix.salesmgmt.modules.customer.service;

import com.optronix.salesmgmt.modules.customer.dto.CreateCustomerRequest;
import com.optronix.salesmgmt.modules.customer.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    CustomerDto createCustomer(CreateCustomerRequest request);
    CustomerDto getCustomerById(Long id);
    List<CustomerDto> getAllCustomers();
}
