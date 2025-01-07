"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import nimalogo from '../../public/nima.png';

interface Medicine {
  name: string;
  type: string;
  quantity: string;
  morning: string;
  afternoon: string;
  evening: string;
  
}

const PrescriptionApp: NextPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("Tablet");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const [scheduleMorning, setScheduleMorning] = useState("");
  const [scheduleAfternoon, setScheduleAfternoon] = useState("");
  const [scheduleEvening, setScheduleEvening] = useState("");
  const [suggestedMedicines, setSuggestedMedicines] = useState<string[]>([]);

    useEffect(() => {
      // Fetch medicines from the API
      const fetchMedicines = async () => {
        try {
          const response = await fetch("/api/medicine");
          const data = await response.json();
          setSuggestedMedicines(data);
        } catch (error) {
          console.error("Error fetching medicines:", error);
        }
      };
      fetchMedicines();
    }, []);

  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    weight: "",
    bp: "",
    pulse: "",
    misc:"",
  });

  const resetDetails = () => {
    setMedicines([]);
    setMedicineName("");
    setMedicineType("Tablet");
    setMedicineQuantity("");
    setScheduleAfternoon("");
    setScheduleMorning("");
    setScheduleEvening("");
    setPatientDetails({
      name: "",
      age: "",
      weight: "",
      bp: "",
      pulse: "",
      misc: "",
    });
  };

  const addMedicine = async () => {
    const newMedicine: Medicine = {
      name: medicineName,
      type: medicineType,
      quantity: medicineQuantity,
      morning: scheduleMorning,
      afternoon: scheduleAfternoon,
      evening: scheduleEvening,
    };

    setMedicines((prev) => [...prev, newMedicine]);
    if (!suggestedMedicines.includes(medicineName)) {
      setSuggestedMedicines((prev) => [...prev, medicineName]);
      // Save the medicine to the API
      try {
        await fetch("/api/medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medicine: medicineName }),
        });
      } catch (error) {
        console.error("Error saving medicine:", error);
      }
    }
    setMedicineName("");
    setMedicineQuantity("");
    setScheduleMorning("");
    setScheduleAfternoon("");
    setScheduleEvening("");
  };
  const deleteMedicine = (index: number) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  // const toggleSchedule = (
  //   index: string,
  //   time: "morning" | "afternoon" | "evening"
  // ) => {
  //   const updatedMedicines = [...medicines];
  //   updatedMedicines[index].schedule[time] = !updatedMedicines[index].schedule[time];
  //   setMedicines(updatedMedicines);
  // };

  const metaDate = new Date();
  const day = String(metaDate.getDate()).padStart(2, '0');
  const month = String(metaDate.getMonth() + 1).padStart(2, '0');
  const year = metaDate.getFullYear();
  const currentDate = `${day}/${month}/${year}`;

  const generatePrescription = async () => {
    const originalDate = currentDate;
  // Format the current date for the file path
  const formattedDate = originalDate.replace(/\//g, "-"); // Replace '/' with '-'

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');  // Ensure two digits (e.g., "09" instead of "9")
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timestamp = `${hours}:${minutes}:${seconds}`;

    const prescriptionHTML = `
    <html>
    <head>
    </style>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          text-align: right;
          margin-bottom: 5px;
          font-family: Tiro Devanagari Sanskrit;
          font-size: 28px;
        }
        
        .header strong {
          margin 0;
        }

        .logo {
            left: 5;
            position: fixed;
        }

        .headerText {
          padding-top: 20px;
        }

        .header p {
          font-size: 12px;
        }

        .patient-info {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              flex-direction: column;
        }

        .patient-info, .medicines-table {
          font-size: 12px;
          margin-top: 10px;
        }

        hr {
          border: 1px solid black;
        }


        .medicines-table table {
          width: 100%;
          height: wrap-content;
          border-collapse: collapse;
          font-size: 12px;
        }

        .medicines-table th, .medicines-table td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
        }

        .medicines-table td {
          padding-top: 20px;
          padding-bottom: 20px;
        }

        .rx-symbol {
          font-size: 20px;
          font-weight: bold;
          margin-top: 20px;
        }
        .footer {
          position: fixed;
          bottom: 0;
          width: 100%;
        }
        .footer h6{
          font-size: 8px;
          margin-top: 2px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo"> <img id="nimalogo" src= ${nimalogo.src} width=100 height=100> </div>
        <div class="headerText">
        <strong>डॅा. गोपाल बी. पाटील</strong>
        <p> बी.ए.एम.एस. (पुणे), रजि. नं. I-29117A-1 </p>
        <p> के-हाळे बु॥, तालुका-रावेर ,जिल्हा-जळगांव. 425508 </p>
        </div>
      </div>
      <hr />
      <div class="patient-info">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px"> <div> <strong>Name:</strong> ${patientDetails.name} </div>
        <div><strong>Date:</strong> ${currentDate} </div> </div> 
        <div style="display: flex; justify-content: space-between;"> <div> <strong>Age:</strong> ${patientDetails.age} </div>
        <div> <strong>Weight:</strong> ${patientDetails.weight}kg </div>
        <div> <strong>B.P.:</strong> ${patientDetails.bp} </div>
        <div> <strong>Pulse:</strong> ${patientDetails.pulse}</div> </div>
        <div style="margin-top: 15px; white-space: pre-wrap;"><strong>Signs & Symptoms:-</strong> ${patientDetails.misc}</div>
      </div>
      <div class="rx-symbol">℞</div>
      <div class="medicines-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Qty.</th>
              <th style="font-size: 12px">सकाळ</th>
              <th style="font-size: 12px">दुपार</th>
              <th style="font-size: 12px">संध्या</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${medicines
              .map(
                (medicine) => `
              <tr>
                <td>${medicine.type}</td>
                <td>${medicine.name}</td>
                <td>${medicine.quantity}</td>
                <td>${medicine.morning}</td>
                <td>${medicine.afternoon}</td>
                <td>${medicine.evening}</td>
                <td> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="footer">
      <hr />
      <h6> १) वरील औषधी डॉक्टरांना दाखविल्या शिवाय घेऊ नये. २) औषधीचा काही दुष्परिणाम दिसल्यास त्वरित औषधी बंद करून डॉक्टरांशी संपर्क साधावा. 
      ३) फेर तपासणी साठी परत येतांना हा कागद सोबत आणावा. ४) फेर तपासणी &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; दिवसांनी. </h6>
      </div>
    </body>
  </html>
    `;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(prescriptionHTML);
      const img = newWindow.document.getElementById("nimalogo");
      if (img) {
        img.onload = () => {
            newWindow.print();
            newWindow.close();
            resetDetails(); // Reset all details after printing
          };
      } 
      else {
        newWindow.print();
        newWindow.close();
        resetDetails(); // Reset all details if image is not found
      }
    }

    const fileName = `${patientDetails.name} ${formattedDate} ${timestamp}`;
  
    try {
      const response = await fetch("/api/savePrescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, prescriptionHTML }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save PDF");
      }
  
      const result = await response.json();
      const filePath = result.filePath;
  
      // Provide a download link to the user
      const link = document.createElement("a");
      link.href = `/backup/${fileName}.pdf`; // Adjust the path if needed
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resetDetails(); // Reset details after completion
    } catch (error) {
      console.error("Error generating prescription:", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
       <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">Papa's Rx</h1>
        <hr className="my-4" />
      </header>

      <div className="mb-4">
        <label className="block font-bold mb-2">Patient Details:</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Patient Name"
            className="text-black border p-2 rounded"
            value={patientDetails.name}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Age"
            className="text-black border p-2 rounded"
            value={patientDetails.age}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, age: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Weight"
            className="text-black border p-2 rounded"
            value={patientDetails.weight}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, weight: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="B.P Count"
            className="text-black border p-2 rounded"
            value={patientDetails.bp}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, bp: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Pulse Count"
            className="text-black border p-2 rounded h-11"
            value={patientDetails.pulse}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, pulse: e.target.value })
            }
          />
          <textarea
            placeholder="Signs & Symptoms"
            wrap="hard"
            className="text-black border p-2 rounded whitespace-pre-wrap h-11"
            value={patientDetails.misc}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, misc: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg">Prescription:</h2>
        <div className="text-black flex items-center gap-4 my-4">
          <select
            className="text-black border p-2 rounded"
            value={medicineType}
            onChange={(e) => setMedicineType(e.target.value)}
          >
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Lotion">Lotion</option>
            <option value="Ointment">Ointment</option>
            <option value="Cream">Cream</option>
            <option value="">Other</option>
          </select>
          <input
            type="text"
            placeholder="Medicine Name"
            className="border p-2 rounded flex-1"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            list="medicine-suggestions"
          />
          <datalist id="medicine-suggestions">
            {suggestedMedicines.map((medicine, idx) => (
              <option key={idx} value={medicine} />
            ))}
          </datalist>
          <input
            type="number"
            placeholder="Quantity"
            className="text-black border p-2 rounded"
            value={medicineQuantity}
            onChange={(e) => setMedicineQuantity(e.target.value)}
          />
          </div>
          <div className="text-black flex items-center gap-4 my-4">
          <input
            type="text"
            placeholder="Morning"
            className="text-black border p-2 px-4 rounded"
            value={scheduleMorning}
            onChange={(e) => setScheduleMorning(e.target.value)}
            />
            <input
                    type="text"
                    placeholder="Afternoon"
                    className="text-black border p-2 px-4 rounded"
                    value={scheduleAfternoon}
                    onChange={(e) => setScheduleAfternoon(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Evening"
                    className="text-black border p-2 px-4 rounded"
                    value={scheduleEvening}
                    onChange={(e) => setScheduleEvening(e.target.value)}
                  />
          <button
            className="bg-blue-500 text-white p-2 px-11 py-2 rounded"
            onClick={addMedicine}
          >
            Add
          </button>
         </div>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-200 text-center">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Morning</th>
              <th className="border border-gray-300 px-4 py-2">Afternoon</th>
              <th className="border border-gray-300 px-4 py-2">Evening</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{medicine.type}</td>
                <td className="border border-gray-300 px-4 py-2">{medicine.name}</td>
                <td className="border border-gray-300 px-4 py-2">{medicine.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {medicine.morning}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {medicine.afternoon}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                 {medicine.evening}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteMedicine(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      <button
        className="bg-green-500 text-white px-6 py-3 rounded mt-6 block mx-auto"
        onClick={generatePrescription}
      >
        Generate Prescription
      </button>
    </div>
  );
};

export default PrescriptionApp;
