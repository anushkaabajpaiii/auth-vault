import requests
import streamlit as st

API = "http://localhost:5000/api/auth"

def refresh_access_token():
    if not st.session_state.get("refreshToken"):
        return False

    res = requests.post(f"{API}/refresh-token", json={
        "refreshToken": st.session_state.refreshToken
    })

    if res.status_code == 200:
        data = res.json()["data"]
        st.session_state.accessToken = data["accessToken"]
        st.session_state.refreshToken = data["refreshToken"]
        return True

    # refresh failed → force logout
    st.session_state.accessToken = None
    st.session_state.refreshToken = None
    return False


def auth_get(url):
    headers = {
        "Authorization": f"Bearer {st.session_state.accessToken}"
    }
    res = requests.get(url, headers=headers)

    if res.status_code == 401:
        if refresh_access_token():
            headers["Authorization"] = f"Bearer {st.session_state.accessToken}"
            return requests.get(url, headers=headers)

    return res
