package utils

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

type ValidationError struct {
	Field   string
	Message string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

type ValidationErrors []ValidationError

func (e ValidationErrors) Error() string {
	if len(e) == 0 {
		return ""
	}
	var msgs []string
	for _, err := range e {
		msgs = append(msgs, err.Error())
	}
	return strings.Join(msgs, "; ")
}

func (e ValidationErrors) HasErrors() bool {
	return len(e) > 0
}

type UserInputValidator struct {
	Username      string
	Email         string
	Password      string
	FullName      string
	Address       string
	PhoneNumber   string
	PaymentMethod string
}

func (v *UserInputValidator) Validate() ValidationErrors {
	var errs ValidationErrors

	if len(v.Username) < 3 {
		errs = append(errs, ValidationError{Field: "username", Message: "must be at least 3 characters"})
	}
	if len(v.Username) > 50 {
		errs = append(errs, ValidationError{Field: "username", Message: "must be at most 50 characters"})
	}
	if !isAlphanumeric(v.Username) {
		errs = append(errs, ValidationError{Field: "username", Message: "must contain only letters, numbers, and underscores"})
	}

	if !isValidEmail(v.Email) {
		errs = append(errs, ValidationError{Field: "email", Message: "invalid email format"})
	}

	if len(v.Password) < 8 {
		errs = append(errs, ValidationError{Field: "password", Message: "must be at least 8 characters"})
	}
	if !hasUppercase(v.Password) {
		errs = append(errs, ValidationError{Field: "password", Message: "must contain at least one uppercase letter"})
	}
	if !hasLowercase(v.Password) {
		errs = append(errs, ValidationError{Field: "password", Message: "must contain at least one lowercase letter"})
	}
	if !hasDigit(v.Password) {
		errs = append(errs, ValidationError{Field: "password", Message: "must contain at least one digit"})
	}

	if len(v.FullName) < 4 {
		errs = append(errs, ValidationError{Field: "fullName", Message: "must be at least 4 characters"})
	}
	if len(v.FullName) > 100 {
		errs = append(errs, ValidationError{Field: "fullName", Message: "must be at most 100 characters"})
	}

	if v.PhoneNumber != "" && !isValidPhoneNumber(v.PhoneNumber) {
		errs = append(errs, ValidationError{Field: "phoneNumber", Message: "invalid phone number format"})
	}

	return errs
}

type ProductInputValidator struct {
	Name            string
	Description     string
	Price           int
	ImageLink       string
	AvailableStocks int
	Category        string
}

func (v *ProductInputValidator) Validate() ValidationErrors {
	var errs ValidationErrors

	if len(v.Name) < 2 {
		errs = append(errs, ValidationError{Field: "name", Message: "must be at least 2 characters"})
	}
	if len(v.Name) > 200 {
		errs = append(errs, ValidationError{Field: "name", Message: "must be at most 200 characters"})
	}

	if len(v.Description) > 5000 {
		errs = append(errs, ValidationError{Field: "description", Message: "must be at most 5000 characters"})
	}

	if v.Price < 0 {
		errs = append(errs, ValidationError{Field: "price", Message: "must be a positive number"})
	}

	if v.AvailableStocks < 0 {
		errs = append(errs, ValidationError{Field: "availableStocks", Message: "must be a positive number"})
	}

	if v.ImageLink != "" && !isValidURL(v.ImageLink) {
		errs = append(errs, ValidationError{Field: "imageLink", Message: "must be a valid URL"})
	}

	return errs
}

type LoginInputValidator struct {
	Email    string
	Password string
}

func (v *LoginInputValidator) Validate() ValidationErrors {
	var errs ValidationErrors

	if !isValidEmail(v.Email) {
		errs = append(errs, ValidationError{Field: "email", Message: "invalid email format"})
	}

	if len(v.Password) == 0 {
		errs = append(errs, ValidationError{Field: "password", Message: "password is required"})
	}

	return errs
}

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

func isValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

var alphanumericRegex = regexp.MustCompile(`^[a-zA-Z0-9_]+$`)

func isAlphanumeric(s string) bool {
	return alphanumericRegex.MatchString(s)
}

func hasUppercase(s string) bool {
	for _, r := range s {
		if unicode.IsUpper(r) {
			return true
		}
	}
	return false
}

func hasLowercase(s string) bool {
	for _, r := range s {
		if unicode.IsLower(r) {
			return true
		}
	}
	return false
}

func hasDigit(s string) bool {
	for _, r := range s {
		if unicode.IsDigit(r) {
			return true
		}
	}
	return false
}

var phoneRegex = regexp.MustCompile(`^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$`)

func isValidPhoneNumber(phone string) bool {
	return phoneRegex.MatchString(phone) && len(phone) >= 7 && len(phone) <= 20
}

var urlRegex = regexp.MustCompile(`^https?://[^\s/$.?#].[^\s]*$`)

func isValidURL(url string) bool {
	return urlRegex.MatchString(url)
}
