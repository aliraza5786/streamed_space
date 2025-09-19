import api from "../libs/api";

export const getProfile = () => {
  return api.get("/profile").then((res) => res.data);
};



export const updateProfile = (payload: {
    u_full_name?: string;
    u_job_title?: string;
    u_department?: string;
    u_organization?: string;
    u_location?: string;
    u_profile_image?: string;
  }) => {
    return api.put('/profile', payload).then(res => res.data);
  };


