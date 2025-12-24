"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { submitPost } from "@/lib/actions";
import * as leoProfanity from "leo-profanity";
import toast from "react-hot-toast";

leoProfanity.loadDictionary();  
 
export default function Page({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  const [profData, setProfData] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const rating = [
    { name: 10 },
    { name: 9 },
    { name: 8 },
    { name: 7 },
    { name: 6 },
    { name: 5 },
    { name: 4 },
    { name: 3 },
    { name: 2 },
    { name: 1 },
  ];
  const params = useParams() as { prof?: string } | undefined;
  const encoded = searchParams?.prof ?? "e30=";

  const selectedTeacherTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="flex bg-white text-black p-1 text-lg rounded-lg align-text-baseline">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props?.placeholder}</span>;
  };

  const teacherOptionTemplate = (option: any) => {
    return (
      <div className="flex border p-2 font-md bg-gray-200 text-black align-text-baseline">
        {option?.image ? (
            <img
            alt={option.name}
            src={option.image}
            className={`mr-2 w-7 h-7 rounded-full`}
          />
        ) : null}
        <div>{option.name}</div>
      </div>
    );
  };

  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [teachingRating, setTeachingRating] = useState<{name: number}>({name:0});
  const [leniencyRating, setLeniencyRating] = useState<{name: number}>({name:0});
  const [correctionRating, setCorrectionRating] = useState<{name: number}>({name:0});
  const [daRating, setDaRating] = useState<{name: number}>({name:0});
  const [remarkRating, setRemarkRating] = useState<string>("");
  const [color, setColor] = useState<string>("bg-green-500");
 
  
function submitReview() {
    console.log(selectedTeacher)
if (!selectedTeacher.name){
  toast.error("Please select a teacher to review.");
  return;

} 
if (teachingRating.name==0 || leniencyRating.name==0 || correctionRating.name==0 || daRating.name==0){
  toast.error("Please provide all ratings before submitting the review.");
  return;
}
const cleaned = leoProfanity.clean(remarkRating.toString());
console.log(cleaned);
const formData = new FormData();
      formData.append("teacherId", selectedTeacher._id);
      formData.append("teaching", teachingRating.name.toString());
      formData.append("leniency", leniencyRating.name.toString());
      formData.append("correction", correctionRating.name.toString());
      formData.append("daQuiz", daRating.name.toString());
      formData.append("remarks", cleaned);
submitPost(formData)
    .then(() => {
        toast.success("Review submitted successfully!");
    })
    .catch((error) => {
        try{toast.error(JSON.parse(error.message)[0].message)}
        catch{
        toast.error("Error submitting review: " + (error instanceof Error ? error.message : "Unknown error"));
        }
        return;
    });
  }




  useEffect(() => {
    fetch("/api/profs")
      .then((res) => res.json())
      .then((data) =>
        setTeachers(Array.isArray(data?.teachers) ? data.teachers : [])
      );

    try {
      const decoded = atob(decodeURIComponent(encoded || ""));
      const parsed = JSON.parse(decoded);
      setProfData(parsed);
      setSelectedTeacher(parsed);
    } catch (err) {
      setProfData(null);
    }
  }, [encoded]);
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <style>{`
        .dropdownPanel { background: gray;  border-radius: 0.5rem; }
        .dropdownPanel .p-dropdown-filter { width: 100%; padding: 0.5rem 0.75rem; }
      `}</style>

      {profData ? (
        <div className="flex flex-col lg:flex-row gap-8 bg-card p-6 rounded-2xl shadow-sm">
          <div className="w-full lg:w-1/3 flex flex-col items-center gap-5">
            {profData.image && (
              <img src={profData.image} alt="Teacher" className="rounded-xl w-full object-cover max-h-56" />
            )}
            <div className="text-4xl font-extrabold">{profData?.name}</div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <label className="text-xl font-semibold">Name:</label>
              <div className="w-full sm:w-56">
                <Dropdown
                  value={selectedTeacher}
                  onChange={(e) => {
                    setSelectedTeacher(e.value);
                    setProfData(e.value);
                  }}
                  options={teachers}
                  optionLabel="name"
                  placeholder="Select a Teacher"
                  filter
                  valueTemplate={selectedTeacherTemplate}
                  itemTemplate={teacherOptionTemplate}
                  className="w-full bg-white text-left text-black py-2 px-3 rounded-lg"
                  panelClassName="dropdownPanel"
                />
              </div>
            </div>

            <div className="text-2xl font-bold">Ratings</div>
            <div className="text-lg">
              Overall Rating: {((teachingRating.name + leniencyRating.name + correctionRating.name + daRating.name) === 0) ? "N.A." : (((teachingRating.name + leniencyRating.name + correctionRating.name + daRating.name) / 4).toFixed(1))}/10
            </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { label: 'Teaching', state: teachingRating, onChange: setTeachingRating },
                { label: 'Leniency', state: leniencyRating, onChange: setLeniencyRating },
                { label: 'Correction', state: correctionRating, onChange: setCorrectionRating },
                { label: 'DA/Quiz', state: daRating, onChange: setDaRating },
              ].map((r) => (
                <div key={r.label}  className="flex items-center justify-between bg-card p-3 rounded-lg shadow-sm ">
                  <div className="font-semibold font-red">{r.label}</div>
                  <div className="w-28">
                    <Dropdown
                      value={r.state}
                      onChange={(e) =>{
                         if(selectedTeacher && selectedTeacher.name && (teachingRating.name==0 || leniencyRating.name==0 || correctionRating.name==0 || daRating.name==0)){
    setColor("bg-red-500");
  }else{
    setColor("bg-green-500");
  }
                        r.onChange(e.value)}}
                      options={rating}
                      optionLabel="name"
                      placeholder="1-10"
                      className="w-full font-secondary text-center rounded-md"
                      panelClassName="dropdownPanel"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="font-semibold font-secondary mb-2">Remarks</div>
              <textarea onChange={(e) => { setRemarkRating(e.target.value) }} placeholder="Write your review" className="w-full p-3 border rounded-md resize-vertical" rows={4}></textarea>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={submitReview} className={` ${color} text-white px-4 py-2 rounded-xl hover:scale-[1.02] transition-transform  w-auto`}>Submit</button>
            </div>
          </div>
        </div>
      ) : (
        <>Loading</>
      )}
    </main>
  );
}
