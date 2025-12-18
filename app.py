import streamlit as st
import requests
def refresh_access_token():
    res = requests.post(
        f"{API}/refresh-token",
        json={"refreshToken": st.session_state.refreshToken}
    )
    if res.status_code == 200:
        st.session_state.accessToken = res.json()["data"]["accessToken"]
        st.session_state.refreshToken = res.json()["data"]["refreshToken"]
        return True
    return False

API = "http://localhost:5000/api/auth"

st.set_page_config(
    page_title="AuthVault",
    layout="centered",
)

# Session storage
if "accessToken" not in st.session_state:
    st.session_state.accessToken = None
if "refreshToken" not in st.session_state:
    st.session_state.refreshToken = None

st.title("🔐 AuthVault Security Portal")

menu = st.sidebar.selectbox(
    "Navigation",
    ["Login", "Profile", "Forgot Password", "Reset Password", "Admin Dashboard", "Logout"]
)

# ---------------- LOGIN ----------------
if menu == "Login":
    st.subheader("Login")

    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        res = requests.post(f"{API}/login", json={
            "email": email,
            "password": password
        })

        if res.status_code == 200:
            data = res.json()["data"]
            st.session_state.accessToken = data["accessToken"]
            st.session_state.refreshToken = data["refreshToken"]
            st.success("Login successful ✅")
        else:
            st.error(res.json()["message"])

# ---------------- PROFILE ----------------
elif menu == "Profile":
    st.subheader("My Profile")

    if not st.session_state.accessToken:
        st.warning("Please login first")
    else:
        headers = {
            "Authorization": f"Bearer {st.session_state.accessToken}"
        }

        from api import auth_get

        res = auth_get(f"{API}/me")


        if res.status_code == 200:
            st.json(res.json()["data"]["user"])
        else:
            st.error("Session expired")

# ---------------- FORGOT PASSWORD ----------------
elif menu == "Forgot Password":
    st.subheader("Forgot Password")

    email = st.text_input("Enter your email")

    if st.button("Send reset link"):
        requests.post(f"{API}/forgot-password", json={"email": email})
        st.success("If this email exists, a reset link has been sent.")

# ---------------- RESET PASSWORD ----------------
elif menu == "Reset Password":
    st.subheader("Reset Password")

    email = st.text_input("Email")
    token = st.text_input("Reset Token")
    new_password = st.text_input("New Password", type="password")

    if st.button("Reset Password"):
        res = requests.post(f"{API}/reset-password", json={
            "email": email,
            "token": token,
            "newPassword": new_password
        })

        if res.status_code == 200:
            st.success("Password reset successful ✅")
        else:
            st.error(res.json()["message"])

# ---------------- ADMIN DASHBOARD ----------------
elif menu == "Admin Dashboard":
    st.subheader("Admin Login Attempts")

    if not st.session_state.accessToken:
        st.warning("Admin login required")
    else:
        headers = {
            "Authorization": f"Bearer {st.session_state.accessToken}"
        }

        res = requests.get(f"{API}/admin/login-attempts", headers=headers)

        if res.status_code == 200:
            st.json(res.json()["data"])
        else:
            st.error("Access denied")

        import pandas as pd

elif menu == "Admin Dashboard":
    st.subheader("Security Analytics")

    res = auth_get(f"{API}/admin/login-attempts")

    if res.status_code == 200:
        data = res.json()["data"]
        df = pd.DataFrame(data)

        df["createdAt"] = pd.to_datetime(df["createdAt"])
        chart = df.groupby(df["createdAt"].dt.date)["success"].count()

        st.line_chart(chart)
        st.dataframe(df)


# ---------------- LOGOUT ----------------
elif menu == "Logout":
    st.subheader("Logout")

    if st.button("Logout from this session"):
        if st.session_state.refreshToken:
            requests.post(f"{API}/logout", json={
                "refreshToken": st.session_state.refreshToken
            })

        st.session_state.accessToken = None
        st.session_state.refreshToken = None
        st.success("Logged out successfully")

    if st.button("Logout from all devices"):
        headers = {
            "Authorization": f"Bearer {st.session_state.accessToken}"
        }
        requests.post(f"{API}/logout-all", headers=headers)
        st.session_state.accessToken = None
        st.session_state.refreshToken = None
        st.success("Logged out from all sessions")
