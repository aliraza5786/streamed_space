<template>
    <AuthLayout>
        <template #form>
            <div class="max-w-[496px] md:mx-auto w-full">
                <div class="mb-12 space-y-2">
                    <h2 class="text-[32px] font-medium text-center text-text-primary">Enter Verification Code</h2>
                    <p class="text-base sm:text-nowrap font-medium text-text-secondary text-center">
                        We sent a five-digit code to your email <span class="font-bold">({{ email }})</span>.
                    </p>
                </div>

                <form @submit.prevent class="space-y-4 w-full">
                    <!-- OTP Inputs -->
                    <div class="flex justify-center gap-4 pb-4">
                        <input v-for="(_, index) in code.length" :key="index" v-model="code[index]" type="text"
                            inputmode="numeric" maxlength="1" autocomplete="one-time-code" enterkeyhint="done"
                            class="w-full aspect-square text-5xl p-1 md:p-2 font-bold text-center border rounded-lg focus:outline-none"
                            :class="[
                                'border-border ',
                                otpError ? 'border-red-500' : '',
                                isPending ? 'opacity-60 pointer-events-none' : ''
                            ]" @keydown="handleKey(index, $event)" @paste.prevent="handlePaste(index, $event)"
                            @input="handleInput(index, $event)" @focus="selectOnFocus" ref="digitRefs" />

                    </div>

                    <Button :disabled="isPending" size="lg" :block="true" @click="verifyCode">
                        {{ isPending ? 'Verifying...' : 'Verify' }}
                    </Button>

                    <p v-if="otpError" class="text-red-500 text-sm text-center mt-2">
                        {{ otpError }}
                    </p>

                    <!-- Resend -->
                    <p class="text-sm font-medium text-text-secondary text-center">
                        Didn't receive an email? Try checking your junk folder.
                        <span class="text-text-primary font-bold cursor-pointer underline" @click="resendCode">
                            {{ isResending ? 'Resending...' : 'Resend code' }}
                        </span>
                    </p>

                    <p v-if="successMessage" class="text-green-600 text-sm text-center mt-2">
                        {{ successMessage }}
                    </p>


                    <p v-if="resendError" class="text-red-500 text-sm text-center mt-2">
                        Failed to resend OTP. Please try again.
                    </p>

                </form>
            </div>
        </template>
    </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { useRouter, useRoute } from 'vue-router';
import AuthLayout from '../../layout/AuthLayout/AuthLayout.vue';
import Button from '../../components/ui/Button.vue';
import { verifyOtp, resendOtp } from '../../services/auth';

const router = useRouter();
const route = useRoute();

const code = ref(['', '', '', '', '']);
const digitRefs = ref<(HTMLInputElement | null)[]>([]);
const otpError = ref('');
const successMessage = ref('');
const email = ref(route.params.email as string || '');

// ✅ Remove success message after delay
watch(successMessage, (val) => {
    if (val) {
        setTimeout(() => {
            successMessage.value = '';
        }, 4000);
    }
});

// ✅ Clear error message if user changes any digit
watch(code, () => {
    if (otpError.value) otpError.value = '';
}, { deep: true });

const isCodeComplete = computed(() => code.value.every((char) => char.length === 1));

// ---------------- VERIFY OTP MUTATION ----------------
const { mutate, isPending } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
        console.log(data, 'OTP verified');

        localStorage.setItem('token', data?.data?.token)
        router.push('/create-profile');
    },
    onError: (err: any) => {
        otpError.value = err?.response?.data?.message || 'Invalid code, please try again.';
    },
});

function verifyCode() {
    if (!isCodeComplete.value) {
        otpError.value = 'Please enter the complete 5-digit code.';
        return;
    }
    const fullCode = code.value.join('');
    mutate({ u_email: email.value, otp: fullCode });
}

// ---------------- HANDLE OTP FIELD ----------------
function handleKey(index: number, e: KeyboardEvent) {
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
        code.value[index] = key;
        e.preventDefault();
        nextTick(() => digitRefs.value[index + 1]?.focus());
    } else if (key === 'Backspace') {
        if (code.value[index]) {
            code.value[index] = '';
        } else if (index > 0) {
            nextTick(() => digitRefs.value[index - 1]?.focus());
        }
    } else if (key === 'ArrowLeft' && index > 0) {
        nextTick(() => digitRefs.value[index - 1]?.focus());
    } else if (key === 'ArrowRight' && index < 4) {
        nextTick(() => digitRefs.value[index + 1]?.focus());
    }
}

onMounted(() => {
    nextTick(() => digitRefs.value[0]?.focus());
});

// ---------------- RESEND OTP MUTATION ----------------
const {
    mutate: triggerResend,
    isPending: isResending,

    error: resendError,
    reset: resetResendStatus,
} = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
        successMessage.value = 'A new code has been sent to your email.';
    },
    onError: (err: any) => {
        otpError.value = err?.response?.data?.message || "Failed to resend code.";
    },
});

function resendCode() {
    otpError.value = '';
    resetResendStatus();

    if (!email.value) {
        otpError.value = 'Email not found. Please login again.';
        return;
    }

    triggerResend({ u_email: email.value });
}
// --- helpers to distribute digits ---
function setCodeFromString(value: string, startIndex = 0) {
    const digits = value.replace(/\D/g, '').slice(0, code.value.length - startIndex).split('')
    if (!digits.length) return

    for (let i = 0; i < digits.length; i++) {
        code.value[startIndex + i] = digits[i]
    }

    // focus next empty or last filled box
    const next = Math.min(startIndex + digits.length, code.value.length - 1)
    nextTick(() => digitRefs.value[next]?.focus())
}

// Handle paste into any box
function handlePaste(index: number, e: ClipboardEvent) {
    const raw = e.clipboardData?.getData('text') ?? ''
    setCodeFromString(raw, index)
}

// Handle typing and mobile multi-char paste into a single box
function handleInput(index: number, e: Event) {
    const el = e.target as HTMLInputElement
    const sanitized = (el.value || '').replace(/\D/g, '')

    if (sanitized.length <= 1) {
        // single digit typed; keep and move forward if filled
        code.value[index] = sanitized
        if (sanitized.length === 1 && index < code.value.length - 1) {
            nextTick(() => digitRefs.value[index + 1]?.focus())
        }
    } else {
        // multiple digits landed here (autofill / mobile paste)
        // distribute starting at current index
        setCodeFromString(sanitized, index)
    }
    // ensure the visible value is a single digit
    el.value = code.value[index] ?? ''
}

// UX: select content on focus so overwriting is easy
function selectOnFocus(e: FocusEvent) {
    const el = e.target as HTMLInputElement
    // delay to let focus settle on mobile
    setTimeout(() => el.select(), 0)
}

</script>