// Simulated auth store
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log('Checking authentication, token exists:', !!token);
  return !!token;
};
