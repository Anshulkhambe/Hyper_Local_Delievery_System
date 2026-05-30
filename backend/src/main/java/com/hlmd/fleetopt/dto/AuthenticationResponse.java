package com.hlmd.fleetopt.dto;

import com.hlmd.fleetopt.entity.Role;

public class AuthenticationResponse {
    private String token;
    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String token, Integer id, String email, String firstName, String lastName, Role role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private Integer id;
        private String email;
        private String firstName;
        private String lastName;
        private Role role;

        public Builder token(String token) { this.token = token; return this; }
        public Builder id(Integer id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder firstName(String firstName) { this.firstName = firstName; return this; }
        public Builder lastName(String lastName) { this.lastName = lastName; return this; }
        public Builder role(Role role) { this.role = role; return this; }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(token, id, email, firstName, lastName, role);
        }
    }
}
