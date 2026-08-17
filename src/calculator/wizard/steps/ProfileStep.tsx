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
      title="আপনার সম্পর্কে জানান"
      description="কর নির্ধারণী বছর ২০২৬-২০২৭ (আয় বছর ২০২৫-২০২৬)। এটি অনুযায়ী আপনার করমুক্ত সীমা ও প্রযোজ্য নিয়ম নির্ধারিত হবে।"
      onNext={onNext}
    >
      <FormSection title="মৌলিক তথ্য">
        <NumberField id="age" label="বয়স" value={profile.age} prefix="" onChange={(v) => set("age", v)} />
        <SelectField
          id="gender"
          label="লিঙ্গ"
          value={profile.gender ?? "prefer-not-to-say"}
          onChange={(v) => set("gender", v)}
          options={[
            { value: "male", label: "পুরুষ" },
            { value: "female", label: "নারী" },
            { value: "third-gender", label: "তৃতীয় লিঙ্গ" },
            { value: "prefer-not-to-say", label: "বলতে চাই না" },
          ]}
        />
        <SelectField
          id="residentialStatus"
          label="আবাসিক অবস্থা"
          value={profile.residentialStatus ?? "resident"}
          onChange={(v) => set("residentialStatus", v)}
          options={[
            { value: "resident", label: "আবাসিক (Resident)" },
            { value: "non-resident", label: "অনাবাসী (Non-resident)" },
          ]}
        />
      </FormSection>

      <FormSection
        title="বিশেষ শ্রেণি"
        description="এগুলোর কারণে আপনার করমুক্ত সীমা বাড়তে পারে — যেটা আপনার জন্য বেশি সুবিধাজনক সেটাই প্রয়োগ করব।"
      >
        <ToggleField
          id="isDisabled"
          label="প্রতিবন্ধী ব্যক্তি"
          checked={profile.isDisabled ?? false}
          onChange={(v) => set("isDisabled", v)}
        />
        <ToggleField
          id="isFreedomFighter"
          label="গেজেটেড যুদ্ধাহত মুক্তিযোদ্ধা / জুলাই যোদ্ধা"
          checked={profile.isFreedomFighter ?? false}
          onChange={(v) => set("isFreedomFighter", v)}
        />
        <NumberField
          id="disabledChildrenCount"
          label="আপনার অভিভাবকত্বে থাকা প্রতিবন্ধী সন্তানের সংখ্যা"
          prefix=""
          value={profile.disabledChildrenCount ?? 0}
          onChange={(v) => set("disabledChildrenCount", v)}
          hint="প্রতি সন্তানের জন্য করমুক্ত সীমায় অতিরিক্ত ৫০,০০০ টাকা যোগ হবে।"
        />
      </FormSection>

      <FormSection title="রিটার্ন সংক্রান্ত তথ্য">
        <ToggleField
          id="hasTin"
          label="আমার TIN আছে"
          checked={profile.hasTin}
          onChange={(v) => set("hasTin", v)}
        />
        <ToggleField
          id="isFirstTimeFiler"
          label="আমি প্রথমবার রিটার্ন দাখিল করছি"
          checked={profile.isFirstTimeFiler ?? false}
          onChange={(v) => set("isFirstTimeFiler", v)}
        />
      </FormSection>

      <FormSection
        title="সম্পদ (ঐচ্ছিক)"
        description="সারচার্জ প্রযোজ্য হতে পারে এমন ক্ষেত্রেই শুধু এটা লাগবে।"
      >
        <NumberField
          id="netWealth"
          label="নিট সম্পদ"
          value={profile.netWealth ?? 0}
          onChange={(v) => set("netWealth", v)}
          hint="৪ কোটি টাকার বেশি হলেই কেবল সারচার্জ প্রযোজ্য হয়।"
        />
        <NumberField
          id="motorVehicleCount"
          label="আপনার মোটরযানের সংখ্যা"
          prefix=""
          value={profile.motorVehicleCount ?? 0}
          onChange={(v) => set("motorVehicleCount", v)}
        />
      </FormSection>
    </StepShell>
  );
}
