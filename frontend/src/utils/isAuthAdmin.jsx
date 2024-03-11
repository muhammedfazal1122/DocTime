import { jwtDecode } from "jwt-decode";
import axios from "axios";
import localStorage from "js-cookie";
import { baseUrl } from "./constants/Constants";

const updateAdminToken = async () => {
  const refreshToken = localStorage.get("refresh");

  try {
    const res = await axios.post(baseUrl + "auth/token/refresh", {
      refresh: refreshToken,
    });

    if (res.status === 200) {
      localStorage.set("access", res.data.access);
      localStorage.set("refresh", res.data.refresh);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const fetchisAdmin = async () => {
  const token = localStorage.get("access");

  try {
    const res = await axios.get(baseUrl + "auth/user/details/", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return res.data.is_superuser;
  } catch (error) {
    return false;
  }
};

const isAuthAdmin = async () => {
  console.log("isAuthAdminisAuthAdmin");
  const accessToken = localStorage.get("access");
  console.log(accessToken,";(accessToken)")
  if (!accessToken) {
    return { name: null, isAuthenticated: false, isAdmin: false };
  }

  const currentTime = Date.now() / 1000;
  let decoded = jwtDecode(accessToken);

  if (decoded.exp > currentTime) {
    let checkAdmin = await fetchisAdmin();
    return {
      name: decoded.first_name,
      isAuthenticated: true,
      isAdmin: checkAdmin,
    };
  } else {
    const updateSuccess = await updateAdminToken();

    if (updateSuccess) {
      let decoded = jwtDecode(accessToken);
      let checkAdmin = await fetchisAdmin();
      return {
        name: decoded.first_name,
        isAuthenticated: true,
        isAdmin: checkAdmin,
      };
    } else {
      return { name: null, isAuthenticated: false, isAdmin: false };
    }
  }
};

export default isAuthAdmin;