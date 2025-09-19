<template>
  <div
    class="py-15 px-2 w-full justify-center items-center max-h-[100dvh] flex flex-col h-[100dvh] overflow-hidden relative ">
    <!-- <video autoplay muted loop playsinline class="absolute inset-0 z-0 w-full h-full object-cover ">
      <source src="../../assets/videos/Glowing-particles-overlay.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video> -->

    <div class="flex justify-between items-center fixed top-0 w-full flex-row px-5 bg-bg-surface border-b border-border"
      v-show="isStepperVisible">
      <div class="flex max-md:flex-wrap max-md:gap-2 text-sm max-md:text-[9px] max- py-5 justify-start gap-4">
        <div v-for="(step, index) in steps" :key="index" class="flex gap-4">
          <!-- Step text: change color based on the index compared to currentStep -->
          <span :class="[index <= currentStep ? 'text-text-primary' : 'text-text-secondary']">{{ step }}</span>
          <!-- Arrow icon, hide it for the last step -->
          <img v-if="index < steps.length - 1" src="../../assets/icons/arrow.svg"
            class="transition-opacity duration-200 max-md:w-2 w-3" alt="arrow icon" />
        </div>

      </div>
      <FontAwesomeIcon :icon="['fas', 'close']" class=" cursor-pointer" @click="handleClose" />
    </div>

    <div
      class="z-2 overflow-y-auto px-3 py-5 relative flex flex-col  gap-10  max-w-[800px] mx-auto w-full items-center">
      <!-- IdealStep (first step) -->
      <template v-if="currentStep === 0">
        <IdealStep @manual="handStepNext"  />
      </template>

      <!-- StepOne (second step) -->
      <StepOne :ai="isAI" v-if="currentStep === 1" ref="stepOneRef" @next="currentStep += 1" />
      <!-- StepTwo (third step) -->
      <StepTwo :ai="true" ref="stepTwoRef" @next="currentStep += 1" v-if="currentStep === 2" />
      <!-- StepThree (fourth step) -->
      <template v-if="currentStep === 3">
        <StepThree :ai="true" />
      </template>

      <!-- StepFour (fifth step) -->
      <template v-if="currentStep === 4">
        <StepFour :ai="true" ref="stepFourRef" />
      </template>
    </div>

    <!-- Navigation Buttons -->
    <div v-if="currentStep != 0"
      class="flex z-2 bg-bg-body justify-between mt-15 fixed bottom-0 w-full px-6  border-t py-6 border-border">
      <Button variant="secondary" size="md" @click="handStepBack">
        <div class="flex items-center gap-2">
          <FontAwesomeIcon class="text-base " :icon="['fas', 'arrow-left']" /> Back
        </div>
      </Button>

      <Button :disabled="stepOneRef?.isPending" size="md" variant="primary" @click="handStepNext">
        <div class="flex items-center w-full justify-between gap-2">
          {{ stepOneRef?.isPending ? 'Continuing...' : 'Continue' }}
          <FontAwesomeIcon class="text-base " :icon="['fas', 'arrow-right']" />
        </div>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import StepOne from "./steps/StepOne.vue";
import StepTwo from "./steps/StepTwo.vue";
import StepThree from "./steps/StepThree.vue";
import IdealStep from "./steps/IdealStep.vue";
import StepFour from "./steps/StepFour.vue";
import Button from "../../components/ui/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
const route = useRouter();
function handleClose() {
  route.push('/')
}
const currentStep = ref(0);
// Manage the visibility of the stepper
const isStepperVisible = ref(true);
const isAI = ref<any>(true);
const stepOneRef = ref<any>(null);
const stepTwoRef = ref<any>(null);
const stepFourRef = ref<any>(null);
const steps = ["Get Started", "Project Setup", "Define Work streams", "Team Planning", "Review Space"];

const handStepNext = (e:any) => {
  if(e=='mannual'){
    isAI.value= false
  }
  if (currentStep.value == 1 && stepOneRef.value) {
    stepOneRef.value.continueHandler()
  } else if (currentStep.value == 2 && stepTwoRef.value) {
    stepTwoRef.value.continueHandler()
  } else if (currentStep.value == 4) {
    stepFourRef.value.createProjectHandler()
  }
  else {
    currentStep.value += 1;
  }
};

const handStepBack = () => {
  currentStep.value -= 1;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
