"use client";
import useHostModal from "@/app/hooks/useHostModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import CountrySelect from "../Inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const HostModal = () => {
  const router = useRouter();
  const hostModal = useHostModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      roomCount: 1,
      tableCount: 1,
      devCount: 1,
      imageSrc: "",
      price: 0,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");

  const devCount = watch("devCount");
  const roomCount = watch("roomCount");
  const tableCount = watch("tableCount");

  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }
    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("New Nomad Created!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        hostModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these options best describes the Nomad?"
        subtitle="Choose a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) =>
                setCustomValue("category", category)
              }
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION)
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is the Nomad located?"
          subtitle="Help other Devs to find this place!"
        />
        <CountrySelect
          onChange={(value) => setCustomValue("location", value)}
          value={location}
        />
        <Map center={location?.latlng} />
      </div>
    );

  if (step === STEPS.INFO)
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share information about the Nomad"
          subtitle="To your best knowledge, list amenities and facilities at the Nomad."
        />
        <Counter
          title="Devs"
          subtitle="How many Devs are coming?"
          value={devCount}
          onChange={(value) => setCustomValue("devCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many Rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Tables"
          subtitle="How many tables do you have?"
          value={tableCount}
          onChange={(value) => setCustomValue("tableCount", value)}
        />
        <hr />
      </div>
    );

  if (step === STEPS.IMAGES)
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of the nomad"
          subtitle="Show devs what your workplace looks like."
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );

  if (step === STEPS.DESCRIPTION)
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Address of the Nomad?"
          subtitle="If you host this place, leave a contact detail in the detail and full-disclosure on costs."
        />
        <Input
          id="title"
          label="Address"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
      </div>
    );

  if (step === STEPS.PRICE)
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How much do you need to spend on this Nomad?"
          subtitle="An average cost it takes to work from this location."
        />
        <Input
          id="price"
          label="Price"
          disabled={isLoading}
          formatPrice
          type="number"
          register={register}
          errors={errors}
          required
        />
      </div>
    );

  return (
    <Modal
      title="Host | Share a Nomad!"
      isOpen={hostModal.isOpen}
      onClose={hostModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      body={bodyContent}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    />
  );
};

export default HostModal;
