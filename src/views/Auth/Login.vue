<template>
  <AuthLayout>
    <template #form>
      <div class="max-w-[500px] md:mx-auto w-full text-text-primary bg-bg-body">
        <h2 class="text-[32px] font-medium mb-12 text-center text-text-primary">Sign in to Streamed</h2>

        <form @submit.prevent="handleLogin" class="space-y-4 w-full">
          <BaseTextField v-model="email" label="Email" placeholder="Email address" size="lg" :error="!!emailError"
            :message="emailError" @blur="touched.email.value = true" />

          <BaseTextField v-model="password" label="Password" placeholder="Enter your password" size="lg" type="password"
            :error="!!passwordError" :message="passwordError" @blur="touched.password.value = true" />

          <Button :disabled="isPending" size="lg" :block="true" type="submit">
            {{ isPending ? 'Signing In...' : 'Continue' }}
          </Button>

          <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
            {{ errorMessage }}
          </p>

          <div class="flex items-center gap-2 mt-4">
            <hr class="text-border w-full h-[1px]" />
            <span class="text-base font-semibold text-[#8B849B]">or</span>
            <hr class="text-border w-full h-[1px]" />
          </div>

          <!-- Social Login Buttons -->
          <div class="flex gap-3 mt-4">
            <button 
              @click="handleGoogleLogin"
              class="flex-1 group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div class="flex items-center justify-center gap-3">
                <div class="relative">
                  <img src="../../assets/icons/google.svg" alt="Google" class="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Google</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>

            <button 
              @click="handleAppleLogin"
              class="flex-1 group relative overflow-hidden bg-black hover:bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <div class="flex items-center justify-center gap-3">
                <div class="relative">
                  <FontAwesomeIcon :icon="['fab', 'apple']" class="text-white text-lg transition-transform group-hover:scale-110" />
                </div>
                <span class="text-sm font-medium text-white">Apple</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
            </button>
          </div>
        </form>

        <p class="text-sm font-medium text-text-secondary text-center mt-6">
          By signing in, you agree to the
          <span class="text-text-primary font-bold">Privacy Policy</span> and
          <span class="text-text-primary font-bold">Terms of Service</span>.
        </p>

        <p class="text-sm font-medium text-text-secondary text-center mt-8">
          Don’t have an account?
          <router-link to="/register" class="text-text-primary font-bold underline">Sign up</router-link>
        </p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

import AuthLayout from '../../layout/AuthLayout/AuthLayout.vue';
import BaseTextField from '../../components/ui/BaseTextField.vue';
import Button from '../../components/ui/Button.vue';
import { login } from '../../services/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();

// Track user interaction
const touched = {
  email: ref(false),
  password: ref(false),
};

// Validation
const emailError = computed(() => {
  if (!touched.email.value) return '';
  if (!email.value.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Invalid email';
  return '';
});

const passwordError = computed(() => {
  if (!touched.password.value) return '';
  if (!password.value) return 'Password is required';
  if (password.value.length < 6) return 'Password must be at least 6 characters';
  return '';
});

const isFormValid = computed(() => !emailError.value && !passwordError.value);

// Vue Query Mutation
const { mutate, isPending } = useMutation({
  mutationFn: login,
  onSuccess: (data) => {
    console.log('Login success response:', data);
    const token = data?.data?.token || data?.token || data?.access_token;
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
    } else {
      console.error('No token found in response:', data);
      errorMessage.value = 'Login succeeded but no authentication token received.';
      return;
    }
    router.push('/');
  },
  onError: (err: any) => {
    console.error('Login error:', err);
    console.error('Error response:', err?.response?.data);
    errorMessage.value = err?.response?.data?.message || 'Login failed. Please try again.';
  },
});

function handleLogin() {
  errorMessage.value = '';
  touched.email.value = true;
  touched.password.value = true;

  if (!isFormValid.value) {
    errorMessage.value = 'Please fill all fields correctly.';
    return;
  }

  mutate({
    u_email: email.value,
    u_password: password.value,
  });
}

// Clear error message when user types again
watch([email, password], () => {
  if (errorMessage.value) errorMessage.value = '';
});

// google login 


function handleGoogleLogin() {
  // if (typeof window.google === 'undefined' || !window.google.accounts) {
  //   console.error('Google script not loaded yet');
  //   return;
  // }

  // window.google.accounts.id.initialize({
  //   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //   callback: handleGoogleResponse,
  // });

  // window.google.accounts.id.prompt();
}

// function handleGoogleResponse(response: any) {
// const jwt = response.credential;
// const decoded = parseJwt(jwt); // You can decode the JWT to get user info

// mutate({
//   // u_email: decoded.email,
//   // u_social_id: decoded.sub,
//   // u_social_type: 'google',
//   // u_full_name: decoded.name,
// });
// }

// Simple JWT decode (not verifying signature)
// function parseJwt(token: string) {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   return JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join('')));
// }
function handleAppleLogin() {
  // window.AppleID.auth.init({
  //   clientId: 'com.your.app.service', // From Apple Developer portal
  //   scope: 'name email',
  //   redirectURI: 'https://yourdomain.com/callback',
  //   usePopup: true,
  // });

  // window.AppleID.auth.signIn().then((response: any) => {
  //   const user = response.user; // { email, name }
  //   const id_token = response.authorization.id_token;

  //   mutate({
  //     u_email: user.email,
  //     u_social_id: response.user?.sub || '', // fallback if needed
  //     u_social_type: 'apple',
  //     u_full_name: user.name?.firstName + ' ' + user.name?.lastName || '',
  //   });
  // }).catch((error: any) => {
  //   console.error('Apple login failed:', error);
  // });
}

</script>
