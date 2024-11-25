import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import styled from "styled-components";
import { Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import toast from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Yup validation schema
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  dob: yup.date().nullable().required("Date of birth is required"), // Handle dayjs correctly
  email: yup.string().email("Invalid email").required("Email is required"),
  otp: yup.string().required("OTP is required"),
});

const SignUp = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleOtpToggle = () => {
    setShowOtp(!showOtp);
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const onSubmit = async (data) => {
    const formattedDate = dayjs(data.dob).format("YYYY-MM-DD");
    const payload = { ...data, dob: formattedDate }; // Formatted data for API

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        payload
      );

      // Assuming the API returns a token in the response
      if (response.data) {
        toast.success("Registration successful!");

        // Store the token in localStorage (or sessionStorage)
        localStorage.setItem("token", response.data.token); // or sessionStorage

        // Navigate to the dashboard after successful sign-up
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    const email = watch("email");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/send-otp`,
        {
          email: email,
        }
      );

      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/verify-otp`,
        {
          email: watch("email"),
          otp: watch("otp"),
        }
      );

      if (response.data) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response?.data || error.message
      );
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <SignUpConatiner>
      <div className="left-side-form-container">
        <ImageDiv>
          <img src="images/icon.svg" alt="" width={"32px"} height={"25px"} />
          <h5 className="img-heading">HD</h5>
        </ImageDiv>
        <div className="right-side-form-container">
          <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-title">
              <Styledh5>Sign up</Styledh5>
              <StyledP>Sign up to enjoy the feature of HD</StyledP>
            </div>
            <div className="inputs-fields-div">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    label="Your Name"
                    variant="outlined"
                    placeholder="Enter your name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Select DOB"
                      {...field}
                      onChange={(newValue) => setValue("dob", newValue)}
                      renderInput={(params) => (
                        <StyledTextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                          fullWidth
                          error={!!errors.dob}
                          helperText={errors.dob?.message}
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <span
                            style={{
                              color: "#367aff",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={handleSendOtp}
                          >
                            {otpSent ? "Resend OTP" : "Send OTP"}
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="OTP"
                    variant="outlined"
                    fullWidth
                    type={showOtp ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleOtpToggle}
                            sx={{
                              padding: "0",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                color: "rgb(54, 122, 255)",
                                cursor: "pointer",
                                fontSize: "12px",
                                marginRight: "3px",
                              }}
                              onClick={handleVerifyOtp}
                            >
                              {otpVerified ? (
                                <CheckCircleIcon
                                  style={{
                                    color: "green",
                                    fontSize: "18px",
                                    marginRight: "3px",
                                    marginTop: "2px",
                                  }}
                                />
                              ) : (
                                "verify"
                              )}
                            </span>
                            {showOtp ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                  />
                )}
              />
              <StyledButton type="submit">Sign Up</StyledButton>
              <div className="or-field">
                <img src="images/vector 1.svg" alt="" />
                <span>or</span>
                <img src="images/vector 2.svg" alt="" />
              </div>
              <GoogleButton
                className="continue-with-google"
                onClick={() => toast.error("Work In Progress")}
              >
                Continue With Google{" "}
                <span style={{ display: "flex" }}>
                  <img src="images/Group.svg" alt="" />
                </span>
              </GoogleButton>
            </div>
          </form>
          <div className="already-have-account">
            Already have a account??{" "}
            <span className="sign-in-span" onClick={handleSignIn}>
              Sign in
            </span>
          </div>
        </div>
      </div>
      <div>
        <img
          src="images/container.png"
          alt="container"
          width={"875px"}
          height={"667px"}
        />
      </div>
    </SignUpConatiner>
  );
};

export default SignUp;

const SignUpConatiner = styled.div`
  display: flex;
  padding: 12px;
  flex-wrap: wrap; /* Ensures content wraps on smaller screens */

  .left-side-form-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    gap: 7px;
    width: 620px;

    @media (max-width: 768px) {
      width: 100%;
      gap: 30px;
      align-items: center; /* Centers content horizontally */
      text-align: center; /* Centers text */
    }
  }

  .right-side-form-container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .already-have-account {
    color: #6c6c6c;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    margin-top: 30px;
  }

  .sign-in-span {
    color: #367aff;
    cursor: pointer;
  }

  .signup-form {
    display: flex;
    flex-direction: column;
    width: 399px;
    gap: 32px;

    @media (max-width: 768px) {
      width: 100%;
      gap: 20px;
    }
  }
  .form-title {
    display: flex;
    flex-direction: column;
  }

  .inputs-fields-div {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Hide the image on mobile */
  @media (max-width: 768px) {
    > div:last-child {
      display: none; /* Hide the container image on mobile */
    }
  }
`;

const StyledButton = styled.button`
  display: flex;
  padding: 16px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #367aff;
  color: #fff;
  border: none;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  @media (max-width: 768px) {
    padding: 12px 6px;
    font-size: 16px;
  }
`;

const GoogleButton = styled.div`
  cursor: pointer;
  color: #232323;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border-radius: 10px;
  border: 1px solid #e6e8e7;
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba;
  gap: 8px;
`;
const Styledh5 = styled.h5`
  margin: 0;
  color: #232323;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ImageDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;

  .img-heading {
    font-weight: 600;
    margin: 0;
  }

  @media (max-width: 768px) {
    justify-content: center; /* Center the content on smaller screens */
    width: 100%; /* Make the image div take up full width */
  }
`;

const StyledP = styled.p`
  margin: 0;
  color: #969696;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StyledTextField = styled(TextField)`
  border-radius: 10px;
  border: 1.5px solid #d9d9d9;
`;
