"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import nimalogo from '../../public/nima.png';

interface Medicine {
  name: string;
  type: string;
  quantity: string;
  schedule: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}

const PrescriptionApp: NextPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("Tab");
  const [medicineQuantity, setMedicineQuantity] = useState("");
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
  });

  const resetDetails = () => {
    setMedicines([]);
    setMedicineName("");
    setMedicineType("Tab");
    setMedicineQuantity("");
    setPatientDetails({
      name: "",
      age: "",
      weight: "",
      bp: "",
      pulse: "",
    });
  };

  const addMedicine = async () => {
    const newMedicine: Medicine = {
      name: medicineName,
      type: medicineType,
      quantity: medicineQuantity,
      schedule: {
        morning: false,
        afternoon: false,
        evening: false,
      },
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
  };
  const deleteMedicine = (index: number) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const toggleSchedule = (
    index: number,
    time: "morning" | "afternoon" | "evening"
  ) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].schedule[time] = !updatedMedicines[index].schedule[time];
    setMedicines(updatedMedicines);
  };

  const metaDate = new Date();
  const day = String(metaDate.getDate()).padStart(2, '0');
  const month = String(metaDate.getMonth() + 1).padStart(2, '0');
  const year = metaDate.getFullYear();
  const currentDate = `${day}/${month}/${year}`;

  const generatePrescription = () => {
    const prescriptionHTML = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 10px;
        }
        h1, h2 {
          text-align: center;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .logo {
          padding-left: 20px;
          margin-left: 20px;
        }
        
        .patient-info {
          display: flex;
          justify-content: space-evenly;
          flex-wrap: wrap;
        }
        .patient-info, .medicines-table {
          margin-top: 20px;
        }

        hr {
          border: 1px solid black;
        }
        .medicines-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .medicines-table th, .medicines-table td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
        }
        .rx-symbol {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img id="nimalogo" src= ${nimalogo.src} width=150 height=150>
        <div>
        <h1>डॅा. गोपाल बी. पाटील</h1>
        बी.ए.एम.एस. (पुणे), रजि. नं. I-29117A-1
        <p> के-हाळे बु.॥ </p>
        </div>
      </div>
      <hr />
      <div class="patient-info">
        <div><strong>Name:</strong> ${patientDetails.name}</div>
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Age:</strong> ${patientDetails.age}</div>
        <div><strong>Weight:</strong> ${patientDetails.weight} kg</div>
        <div><strong>B.P.:</strong> ${patientDetails.bp}</div>
        <div><strong>Pulse:</strong> ${patientDetails.pulse}</div>
      </div>
      <div class="rx-symbol">℞</div>
      <div class="medicines-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Morning</th>
              <th>Afternoon</th>
              <th>Evening</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${medicines
              .map(
                (medicine) => `
              <tr>
                <td>${medicine.type}</td>
                <td>${medicine.name}</td>
                <td>${medicine.schedule.morning ? "1" : "-"}</td>
                <td>${medicine.schedule.afternoon ? "1" : "-"}</td>
                <td>${medicine.schedule.evening ? "1" : "-"}</td>
                <td>${medicine.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
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
      } else {
        newWindow.print();
        newWindow.close();
        resetDetails(); // Reset all details if image is not found
      }
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
            type="text"
            placeholder="Pulse Count"
            className="text-black border p-2 rounded"
            value={patientDetails.pulse}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, pulse: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg">Prescription:</h2>
        <div className="text-black flex items-center gap-4 my-4">
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
          <select
            className="text-black border p-2 rounded"
            value={medicineType}
            onChange={(e) => setMedicineType(e.target.value)}
          >
            <option value="Tab">Tablet</option>
            <option value="Cap">Capsule</option>
            <option value="Syr">Syrup</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            className="text-black border p-2 rounded"
            value={medicineQuantity}
            onChange={(e) => setMedicineQuantity(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addMedicine}
          >
            Add
          </button>
         </div>
          {/* <header className="text-center mb-4">
            <h1 className="text-xl font-bold">Doctor's Name</h1>
            <p>Address, Registration No.</p>
            <hr className="my-2" />
          </header> */}
          {/* <div className="mb-4">
            <p>
              <strong>Patient Name:</strong> {patientDetails.name}
            </p>
            <p>
              <strong>Date:</strong> {currentDate}
            </p>
            <p>
              <strong>Age:</strong> {patientDetails.age}
              <span className="ml-4">
                <strong>Weight:</strong> {patientDetails.weight} kg
              </span>
            </p>
            <p>
              <strong>B.P:</strong> {patientDetails.bp}
              <span className="ml-4">
                <strong>Pulse:</strong> {patientDetails.pulse}
              </span>
            </p>
          </div> */}
          {/* <h2 className="font-bold text-2xl mb-2">℞</h2>
          <table className="table-auto w-full border-collapse border border-gray-200 text-center">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Morning</th>
                <th className="border border-gray-300 px-4 py-2">Afternoon</th>
                <th className="border border-gray-300 px-4 py-2">Evening</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{medicine.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{medicine.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Might need to change later
                    {medicine.schedule.morning ? "1" : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {medicine.schedule.afternoon ? "1" : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {medicine.schedule.evening ? "1" : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{medicine.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>

        <table className="table-auto w-full border-collapse border border-gray-200 text-center">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Morning</th>
              <th className="border border-gray-300 px-4 py-2">Afternoon</th>
              <th className="border border-gray-300 px-4 py-2">Evening</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{medicine.type}</td>
                <td className="border border-gray-300 px-4 py-2">{medicine.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={medicine.schedule.morning}
                    onChange={() => toggleSchedule(index, "morning")}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={medicine.schedule.afternoon}
                    onChange={() => toggleSchedule(index, "afternoon")}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={medicine.schedule.evening}
                    onChange={() => toggleSchedule(index, "evening")}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{medicine.quantity}</td>
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
        Generate Printable Prescription
      </button>
    </div>
  );
};

export default PrescriptionApp;
