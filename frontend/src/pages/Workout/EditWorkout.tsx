import { SlButton, SlInput } from "../../components/index.ts";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

interface EditWorkout {
  description?: string;
  dateAdded?: string;
}

export const EditWorkout = () => {
  const navigation = useNavigate();
  const { id } = useParams();
  const { handleSubmit, register, reset } = useForm<EditWorkout>();

useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3001/workout/${id}`)
      .then(res => res.json())
      .then((data: { description: string; dateAdded: string }) => {
        reset({
          description: data.description,
          dateAdded: data.dateAdded.split("T")[0],
        });
      })
      .catch(console.error);
  }, [id, reset]);

  const onSubmit = async (data: EditWorkout) => {
    try {
      await fetch(`http://localhost:3001/workout/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      navigation("/workout");
    } catch (e) {
      console.error("Failed to create user", e);
    }
  };

  return (
    <>
      <h1>Edit Workout {id}</h1>

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
        <SlButton type={"submit"}>Edit Workout</SlButton>
      </form>
    </>
  );
};
