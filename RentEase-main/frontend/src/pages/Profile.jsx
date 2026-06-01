import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import NavBar from "../components/NavBar";
import { fetchProfile, updateProfile } from "../service/apiUser";
import { loginSuccess } from "../store/authReducer";

const Profile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  const [form, setForm] = useState({ first_name: "", last_name: "" });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const prev = JSON.parse(localStorage.getItem("user") || "{}");
      const merged = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(merged));
      dispatch(loginSuccess({ user: merged }));
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(error.message || "Profile update failed"),
  });

  const effectiveForm =
    form.first_name || form.last_name
      ? form
      : {
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
        };

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-rentease-yellow mb-6">My Profile</h1>
        {isLoading ? (
          <p className="text-rentease-light">Loading profile...</p>
        ) : (
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-6 space-y-4">
            <input
              value={effectiveForm.first_name}
              onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
              className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
              placeholder="First name"
            />
            <input
              value={effectiveForm.last_name}
              onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
              className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
              placeholder="Last name"
            />
            <input
              value={profile?.email || ""}
              disabled
              className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/10 text-rentease-light/60"
            />
            <button
              type="button"
              onClick={() => updateMutation.mutate(effectiveForm)}
              disabled={updateMutation.isPending}
              className="px-6 py-3 bg-rentease-yellow text-rentease-dark font-medium disabled:opacity-60"
            >
              {updateMutation.isPending ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
