import type { TaxpayerProfile } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import SelectField from "../../../components/forms/SelectField";
import ToggleField from "../../../components/forms/ToggleField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";

interface ProfileStepProps {
  stepIndex: number;
  totalSteps: number;
  profile: TaxpayerProfile;
  onChange: (profile: TaxpayerProfile) => void;
  onNext: () => void;
}

export default function ProfileStep({
  stepIndex,
  totalSteps,
  profile,
  onChange,
  onNext,
}: ProfileStepProps) {
  const set = <K extends keyof TaxpayerProfile>(key: K, value: TaxpayerProfile[K]) =>
    onChange({ ...profile, [key]: value });

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Tell us about yourself"
      description="Assessment Year 2026-2027 (Income Year 2025-2026). This decides which tax-free threshold and rules apply to you."
      onNext={onNext}
    >
      <FormSection title="Basics">
        <NumberField id="age" label="Age" value={profile.age} prefix="" onChange={(v) => set("age", v)} />
        <SelectField
          id="gender"
          label="Gender"
          value={profile.gender ?? "prefer-not-to-say"}
          onChange={(v) => set("gender", v)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "third-gender", label: "Third gender" },
            { value: "prefer-not-to-say", label: "Prefer not to say" },
          ]}
        />
        <SelectField
          id="residentialStatus"
          label="Residential status"
          value={profile.residentialStatus ?? "resident"}
          onChange={(v) => set("residentialStatus", v)}
          options={[
            { value: "resident", label: "Resident" },
            { value: "non-resident", label: "Non-resident" },
          ]}
        />
      </FormSection>

      <FormSection
        title="Special categories"
        description="These can raise your tax-free threshold — we'll apply whichever gives you the best result."
      >
        <ToggleField
          id="isDisabled"
          label="Person with disability"
          checked={profile.isDisabled ?? false}
          onChange={(v) => set("isDisabled", v)}
        />
        <ToggleField
          id="isFreedomFighter"
          label="Gazetted war-wounded freedom fighter / July fighter"
          checked={profile.isFreedomFighter ?? false}
          onChange={(v) => set("isFreedomFighter", v)}
        />
        <NumberField
          id="disabledChildrenCount"
          label="Number of disabled children you're the guardian of"
          prefix=""
          value={profile.disabledChildrenCount ?? 0}
          onChange={(v) => set("disabledChildrenCount", v)}
          hint="Adds BDT 50,000 to your tax-free threshold per child."
        />
      </FormSection>

      <FormSection title="Filing details">
        <ToggleField
          id="hasTin"
          label="I have a TIN"
          checked={profile.hasTin}
          onChange={(v) => set("hasTin", v)}
        />
        <ToggleField
          id="isFirstTimeFiler"
          label="This is my first time filing a return"
          checked={profile.isFirstTimeFiler ?? false}
          onChange={(v) => set("isFirstTimeFiler", v)}
        />
      </FormSection>

      <FormSection
        title="Wealth (optional)"
        description="Only needed if your net wealth might trigger the wealth surcharge."
      >
        <NumberField
          id="netWealth"
          label="Net wealth"
          value={profile.netWealth ?? 0}
          onChange={(v) => set("netWealth", v)}
          hint="Surcharge only applies above BDT 4 crore."
        />
        <NumberField
          id="motorVehicleCount"
          label="Number of motor vehicles you own"
          prefix=""
          value={profile.motorVehicleCount ?? 0}
          onChange={(v) => set("motorVehicleCount", v)}
        />
      </FormSection>
    </StepShell>
  );
}
