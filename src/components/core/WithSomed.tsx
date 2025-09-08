"use client";

import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "../basic-toast";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";

interface WithSosmedProps {
  role?: string
  setLoading: (val: boolean) => void
  url: 'sign-in' | 'sign-up'
  remember?: boolean
}
const WithSosmed = ({ role, setLoading, url, remember }: WithSosmedProps) => {

  const { setIsLogin, setAuth } = useAuthStore()
  const { setShowSignIn, setShowSignUp } = useAuthUIStore()
  const toast = useToast()


  const handleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true)
      console.log(credentialResponse)
      const access_token = credentialResponse.access_token; // ambil token dari Google
      console.log(access_token)
      const payload = url === 'sign-up' ? {
        access_token,
        role
      } : {
        access_token,
        remember
      }
      const { data } = await apiCall.post(`/auth/google/${url}`, payload);

      if (data.success) {
        setIsLogin(true)
        setShowSignIn(false)
        setShowSignUp(false)
        setAuth(data.data.email, data.data.role, data.data.profile_picture)
        toast.success(data.message)
        console.log(data)
      }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false)
    }
  };

  const handleError = () => {
    toast.error('faild login')
  };


  const loginGoogle = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <div className="flex gap-3 w-full justify-center mt-2">


      {/* Tombol Google resmi */}
      <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
        onClick={() => loginGoogle()}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-6 h-6"
        />
      </button>

    </div>
  );
};

export default WithSosmed;
