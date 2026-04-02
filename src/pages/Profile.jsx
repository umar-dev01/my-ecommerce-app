import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ImageUpload from "../components/ImageUpload";

function withCacheBuster(url, version) {
  if (!url || /^blob:/i.test(url) || /^data:/i.test(url)) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
}

function getImageUrl(path, version = Date.now()) {
  if (!path) return null;
  const apiBase = import.meta.env.VITE_API_URL || "";

  if (path.startsWith("/images/")) {
    return withCacheBuster(`${apiBase}${path}`, version);
  }

  if (apiBase && path.startsWith(`${apiBase}/images/`)) {
    return withCacheBuster(path, version);
  }

  if (/^https?:\/\//i.test(path)) return withCacheBuster(path, version);
  return withCacheBuster(`${import.meta.env.VITE_API_URL}${path}`, version);
}

function Profile() {
  // ✅ FIX 2: Pull fetchUserData from context
  const { user, token, fetchUserData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ─── Profile Form State ───────────────────────────────
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    image: user?.image || "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [imagePreview, setImagePreview] = useState(
    getImageUrl(user?.image, imageVersion),
  );

  // ─── Password Form State ──────────────────────────────
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ─── Forgot Password State ────────────────────────────
  const [step, setStep] = useState(1);
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

  // Keep form values in sync when user is loaded or refreshed from context.
  useEffect(() => {
    if (!user) return;

    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      image: user.image || "",
    });
  }, [user]);

  // Keep preview synced with server image unless a local file preview is active.
  useEffect(() => {
    if (selectedImage) return;
    if (user?.image) {
      setImagePreview(getImageUrl(user.image, imageVersion));
    } else {
      setImagePreview(null);
    }
  }, [user, selectedImage, imageVersion]);

  // ─── Handle Profile Input Change ──────────────────────
  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess(false);
    setProfileError(null);
  }

  // ─── Handle Image Selection ───────────────────────────
  const handleImageSelect = (file) => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(URL.createObjectURL(file));
    setSelectedImage(file);
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

  // ─── Submit Profile Update WITH Image Upload ──────────
  async function handleProfileSubmit(e) {
    e.preventDefault();

    if (!profileData.name.trim() || !profileData.email.trim()) {
      setProfileError("Name and email are required");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);

      async function sendProfileUpdate(imageFieldName) {
        const formData = new FormData();
        formData.append("name", profileData.name);
        formData.append("email", profileData.email);
        formData.append("phone", profileData.phone || "");

        if (selectedImage) {
          formData.append(imageFieldName, selectedImage);
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/user/me`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        let data = null;
        const raw = await res.text();
        if (raw) {
          try {
            data = JSON.parse(raw);
          } catch {
            data = { message: raw };
          }
        }

        return { res, data };
      }

      let { res, data } = await sendProfileUpdate("photo");

      if (!res.ok && selectedImage) {
        const firstMessage = data?.message?.toLowerCase() || "";
        const shouldRetryWithImage =
          firstMessage.includes("unexpected field") ||
          firstMessage.includes("photo") ||
          firstMessage.includes("multipart") ||
          res.status >= 500;

        if (shouldRetryWithImage) {
          const retry = await sendProfileUpdate("image");
          res = retry.res;
          data = retry.data;
        }
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setProfileSuccess(true);
      setSelectedImage(null);
      await fetchUserData(token);
      setImageVersion(Date.now());
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  }

  // ─── Submit Password Update ───────────────────────────
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
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  }

  // ─── Step 1: Send Verification Code ───────────────────
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, code: verificationCode }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      setStep(3);
      setForgotSuccess(false);
      setForgotError(null);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  // ─── Step 3: Reset Password ───────────────────────────
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
          headers: { "Content-Type": "application/json" },
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

  function handleLogoutClick() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            My Profile
          </h1>
          <p className="text-gray-500 font-lato">Home &gt; My Profile</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white p-6 shadow-sm flex items-center gap-6">
            <ImageUpload
              onImageUpload={handleImageSelect}
              currentImage={imagePreview}
            />

            <div>
              <h2 className="font-josefin font-bold text-hdark text-2xl">
                {profileData.name}
              </h2>
              <p className="font-lato text-gray-500 text-sm">
                {profileData.email}
              </p>
              <span className="inline-block mt-2 bg-hlight text-hpink font-josefin text-xs font-bold px-3 py-1">
                {user?.role || "Customer"}
              </span>

              <div className="mt-4 flex items-center gap-3">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="font-josefin text-sm font-semibold px-5 py-2 bg-hpink text-white hover:bg-pink-700 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-josefin text-sm font-semibold px-5 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form 1 — Profile Info with Image Upload */}
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

          {/* Form 2 — Change Password */}
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

          {/* Form 3 — Forgot Password */}
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
                {forgotSuccess && step === 2 && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 font-lato text-sm mb-6">
                    ✅ Verification code sent to {forgotEmail}!
                  </div>
                )}

                {forgotSuccess && step === 3 && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 font-lato text-sm mb-6">
                    ✅ Password reset successfully!
                  </div>
                )}

                {forgotError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-lato text-sm mb-6">
                    ❌ {forgotError}
                  </div>
                )}

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

                {step === 2 && (
                  <form onSubmit={handleVerifyCode}>
                    <div className="mb-6">
                      <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                      />
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
                        onClick={() => setStep(1)}
                        className="font-josefin font-semibold px-8 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}

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
