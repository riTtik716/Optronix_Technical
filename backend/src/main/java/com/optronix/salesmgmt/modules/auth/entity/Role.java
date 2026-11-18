package com.optronix.salesmgmt.modules.auth.entity;

public enum Role {
    ROLE_SALES_EMPLOYEE,
    ROLE_SALES_MANAGER,
    ROLE_ADMIN;

    public String getAuthorityName() {
        return this.name();
    }
}
