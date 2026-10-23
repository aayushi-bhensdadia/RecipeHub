// Only these user fields are ever sent to the client (never the password hash).
export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  created: u.created,
});
