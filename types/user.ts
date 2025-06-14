export interface User {
  username: string;
  role: "developer" | "admin_umkm" | "kasir_umkm";
  tokoId: string;
  plan: "free" | "pro";
}
