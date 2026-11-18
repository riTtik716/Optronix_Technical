package com.optronix.salesmgmt.modules.customer.service;

import com.optronix.salesmgmt.exception.ResourceNotFoundException;
import com.optronix.salesmgmt.modules.customer.dto.CreateCustomerRequest;
import com.optronix.salesmgmt.modules.customer.dto.CustomerDto;
import com.optronix.salesmgmt.modules.customer.entity.Customer;
import com.optronix.salesmgmt.modules.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public CustomerDto createCustomer(CreateCustomerRequest request) {
        Customer customer = new Customer(
                request.companyName(),
                request.contactPerson(),
                request.contactEmail(),
                request.contactPhone(),
                request.address()
        );
        Customer saved = customerRepository.save(customer);
        return CustomerDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return CustomerDto.fromEntity(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerDto::fromEntity)
                .toList();
    }
}
