import {  useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SlButton, SlInput } from '../../components/index.ts';


interface AddWorkout {
    description:string,
    dateAdded?:Date
}

export const AddWorkout = () => {
  const { handleSubmit, register } = useFormContext<AddWorkout>();
  const navigation = useNavigate();

  const onSubmit = async (data: AddWorkout) => {
    try {
      await fetch("http://localhost:3001/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      navigation("/workout");
    } catch (e) {
      console.error("Failed to create workout", e);
    }
  };

  return (
    <>
      <h1>Add Workout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SlInput
          type={"text"}
          placeholder={"Description"}
          {...register("description")}
        />
        
        <SlInput
          type={"date"}
          placeholder={"Date"}
          {...register("dateAdded")}
        />
        <SlButton type={"submit"}>Add Workout</SlButton>
      </form>
    </>
  );
};
