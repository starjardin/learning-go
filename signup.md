## Sign up

Context: As a new user I would like to sign up to the platform
AC
FE
1. I can see required field on the page
1. Password and confirm password validation
1. Send a request when submit button is clicked

BE
1. Validate request from FE
BE generates a verification token, stores it with expiry.
1. BE sends email with link: https://yoursite.com/verify?token=abc123
1. User clicks link → BE validates token → marks email_verified = true.
1. Redirect to login page: “Email confirmed! Please sign in.”
🔹 Login
1. User enters email + password.
1. BE checks:
1. Does user exist?
1. Is password correct (via hash comparison)?
(Optional) Is email verified? (You can require this or allow limited access before verification)
1. If valid → issue a session cookie or JWT → user is logged in.

## Sign in

FE
1. I can see required field on the page
1. Send a request when submit button is clicked

BE
1. Validate request from FE
1. Does user exist?
1. Is password correct (via hash comparison)?
(Optional) Is email verified? (You can require this or allow limited access before verification)
1. If valid → issue a session cookie or JWT → user is logged in.