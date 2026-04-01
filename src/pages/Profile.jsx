import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, token } = useContext(AuthContext);

  // ─── Profile Form State ───────────────────────────────
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // ─── Password Form State (for logged-in users) ─────────
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ─── Forgot Password State (2-step verification) ───────
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: reset password
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false);

  // ─── Handle Profile Input Change ──────────────────────
  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess(false);
    setProfileError(null);
  }

  // ─── Handle Password Input Change ─────────────────────
  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordSuccess(false);
    setPasswordError(null);
  }

  // ─── Handle Reset Password Input Change ───────────────
  function handleResetPasswordChange(e) {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  }

  // ─── Submit Profile Update ────────────────────────────
  async function handleProfileSubmit(e) {
    e.preventDefault();

    if (!profileData.name.trim() || !profileData.email.trim()) {
      setProfileError("Name and email are required");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  }

  // ─── Submit Password Update (for logged-in users) ─────
  async function handlePasswordSubmit(e) {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/updateMyPassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            password: passwordData.newPassword,
            passwordConfirm: passwordData.confirmNewPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  }

  // ─── Step 1: Send Verification Code via Email ─────────
  async function handleSendCode(e) {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address");
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      // Move to step 2 (verify code)
      setStep(2);
      setForgotSuccess(true);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  // ─── Step 2: Verify Code ──────────────────────────────
  async function handleVerifyCode(e) {
    e.preventDefault();

    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setForgotError("Please enter the 6-digit verification code");
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
            code: verificationCode,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      // Move to step 3 (reset password)
      setStep(3);
      setForgotSuccess(false);
      setForgotError(null);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  // ─── Step 3: Reset Password with Verified Code ────────
  async function handleResetPassword(e) {
    e.preventDefault();

    if (resetData.newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters");
      return;
    }

    if (resetData.newPassword !== resetData.confirmNewPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/reset-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
            code: verificationCode,
            password: resetData.newPassword,
            passwordConfirm: resetData.confirmNewPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // Reset everything and close form
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotForm(false);
        setStep(1);
        setForgotEmail("");
        setVerificationCode("");
        setResetData({ newPassword: "", confirmNewPassword: "" });
        setForgotSuccess(false);
      }, 2000);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  // ─── Reset Forgot Password Form ───────────────────────
  function resetForgotForm() {
    setShowForgotForm(false);
    setStep(1);
    setForgotEmail("");
    setVerificationCode("");
    setResetData({ newPassword: "", confirmNewPassword: "" });
    setForgotError(null);
    setForgotSuccess(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            My Profile
          </h1>
          <p className="text-gray-500 font-lato">Home &gt; My Profile</p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* ── Profile Header Card ── */}
          <div className="bg-white p-6 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 bg-hpurple rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-josefin font-bold text-3xl">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="font-josefin font-bold text-hdark text-2xl">
                {user?.name}
              </h2>
              <p className="font-lato text-gray-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 bg-hlight text-hpink font-josefin text-xs font-bold px-3 py-1">
                {user?.role || "Customer"}
              </span>
            </div>
          </div>

          {/* ── Form 1 — Profile Info ── */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-josefin text-xl font-bold text-hdark mb-6">
              Personal Information
            </h2>

            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 font-lato text-sm mb-6">
                ✅ Profile updated successfully!
              </div>
            )}

            {profileError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-lato text-sm mb-6">
                ❌ {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                  />
                </div>

                <div>
                  <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                  />
                </div>

                <div>
                  <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="03001234567"
                    className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className={`font-josefin font-semibold px-8 py-2 transition ${
                  profileLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-hpink text-white hover:bg-pink-700"
                }`}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* ── Form 2 — Change Password (Logged In Users) ── */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-josefin text-xl font-bold text-hdark mb-6">
              Change Password
            </h2>

            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 font-lato text-sm mb-6">
                ✅ Password changed successfully!
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-lato text-sm mb-6">
                ❌ {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                  />
                </div>

                <div>
                  <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 8 characters"
                    className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                  />
                </div>

                <div>
                  <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repeat new password"
                    className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className={`font-josefin font-semibold px-8 py-2 transition ${
                  passwordLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-hdark text-white hover:bg-gray-800"
                }`}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* ── Form 3 — Forgot Password (2-Step Verification) ── */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-josefin text-xl font-bold text-hdark mb-6">
              Forgot Password?
            </h2>

            {!showForgotForm ? (
              <button
                onClick={() => setShowForgotForm(true)}
                className="text-hpink hover:text-pink-700 text-sm font-lato underline"
              >
                Forgot your password? Click here
              </button>
            ) : (
              <>
                {/* Success Message */}
                {forgotSuccess && step === 2 && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 font-lato text-sm mb-6">
                    ✅ Verification code sent to {forgotEmail}! Check your
                    inbox.
                  </div>
                )}

                {forgotSuccess && step === 3 && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 font-lato text-sm mb-6">
                    ✅ Password reset successfully! You can now login with your
                    new password.
                  </div>
                )}

                {/* Error Message */}
                {forgotError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-lato text-sm mb-6">
                    ❌ {forgotError}
                  </div>
                )}

                {/* Step 1: Enter Email */}
                {step === 1 && (
                  <form onSubmit={handleSendCode}>
                    <div className="mb-6">
                      <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send a 5-digit verification code to your email
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className={`font-josefin font-semibold px-8 py-2 transition ${
                          forgotLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-hpurple text-white hover:bg-purple-800"
                        }`}
                      >
                        {forgotLoading ? "Sending..." : "Send Code"}
                      </button>

                      <button
                        type="button"
                        onClick={resetForgotForm}
                        className="font-josefin font-semibold px-8 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Enter Verification Code */}
                {step === 2 && (
                  <form onSubmit={handleVerifyCode}>
                    <div className="mb-6">
                      <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(e.target.value.trim())
                        }
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the 6-digit code sent to {forgotEmail}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className={`font-josefin font-semibold px-8 py-2 transition ${
                          forgotLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-hpurple text-white hover:bg-purple-800"
                        }`}
                      >
                        {forgotLoading ? "Verifying..." : "Verify Code"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setForgotError(null);
                        }}
                        className="font-josefin font-semibold px-8 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                  <form onSubmit={handleResetPassword}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={resetData.newPassword}
                          onChange={handleResetPasswordChange}
                          placeholder="Minimum 8 characters"
                          className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                        />
                      </div>

                      <div>
                        <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={resetData.confirmNewPassword}
                          onChange={handleResetPasswordChange}
                          placeholder="Repeat new password"
                          className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className={`font-josefin font-semibold px-8 py-2 transition ${
                          forgotLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {forgotLoading ? "Resetting..." : "Reset Password"}
                      </button>

                      <button
                        type="button"
                        onClick={resetForgotForm}
                        className="font-josefin font-semibold px-8 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
