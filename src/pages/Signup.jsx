import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    variant: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allFieldsFilled =
    formData.email.trim() !== "" &&
    formData.password !== "" &&
    formData.confirmPassword !== "";

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setAlert({ variant: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setAlert({ variant: "", message: "" });

    if (!allFieldsFilled) {
      setAlert({
        variant: "danger",
        message: "Please fill in all fields.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setAlert({
        variant: "danger",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!passwordsMatch) {
      setAlert({
        variant: "danger",
        message: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create your account. Please try again.",
        );
      }

      console.log("User has successfully signed up");

      setAlert({
        variant: "success",
        message: "Your account has been created successfully!",
      });

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Signup request failed:", error);

      setAlert({
        variant: "danger",
        message:
          error instanceof TypeError
            ? "Unable to connect to the server. Please check your connection and try again."
            : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Container className="signup-container">
        <div className="brand">
          <div className="brand-icon">
            <Mail size={27} />
          </div>
          <span>
            Mail<span className="brand-accent">Box</span>
          </span>
        </div>

        <Card className="signup-card border-0">
          <Card.Body>
            <div className="signup-heading">
              <span className="eyebrow">YOUR INBOX STARTS HERE</span>
              <h1>Create your account</h1>
              <p>One account for all the conversations that matter.</p>
            </div>

            {alert.message && (
              <Alert
                variant={alert.variant}
                dismissible
                onClose={() => setAlert({ variant: "", message: "" })}
                role="alert"
              >
                {alert.message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="signupEmail">
                <Form.Label>Email address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Mail size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <LockKeyhole size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="signupConfirmPassword">
                <Form.Label>Confirm password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <LockKeyhole size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    isInvalid={
                      formData.confirmPassword !== "" && !passwordsMatch
                    }
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    disabled={loading}
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    Passwords do not match.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button
                type="submit"
                className="signup-button w-100"
                disabled={!allFieldsFilled || !passwordsMatch || loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </Form>

            <div className="signup-footer">
              <span>Private by design.</span>
              <span>Made for your everyday conversations.</span>
            </div>
          </Card.Body>
        </Card>

        <p className="page-note">A calmer space for your inbox.</p>
      </Container>
    </div>
  );
}

export default Signup;
