"use client";
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
import useShareModal from "@/app/hooks/useShareModal";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const ShareModal = () => {
  const router = useRouter();
  const shareModal = useShareModal();
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
      roomCount: 0,
      tableCount: 0,
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
      // .then(() => {
      //   // First request succeeded
      //   // Make another request
      //   return axios.post("/api/listings", data);
      // })
      .then(() => {
        toast.success("A Nomad has been shared!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        shareModal.onClose();
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
        title="Which of these options best describes the Nomad you found?"
        subtitle="Choose a category that best suits the location."
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
          title="Where is your found Nomad located?"
          subtitle="Help other Devs to find this place too!"
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
          title="Share information about this place"
          subtitle="List amenities and facilities at this place."
        />
        <Counter
          title="Devs"
          subtitle="How many Devs did you bring along? (best for how many devs?)"
          value={devCount}
          onChange={(value) => setCustomValue("devCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="Is there a separate room that a team can use? (0 means no private/separate room)"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Tables"
          subtitle="How many tables in the room? (OR number of seats, leave at 0 if no private room)"
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
          title="Add photo of the place"
          subtitle="Show other devs what your found Nomad looks like."
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
          title="What is the name and address of this location?"
          subtitle="What's the best way to get here?"
        />
        <Input
          id="title"
          label="Address / City"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="How to get here"
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
          title="How much did you pay at this location?"
          subtitle="How much should people expect to pay?"
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
      title="Share your found Nomad!"
      isOpen={shareModal.isOpen}
      onClose={shareModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      body={bodyContent}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    />
  );
};

export default ShareModal;
