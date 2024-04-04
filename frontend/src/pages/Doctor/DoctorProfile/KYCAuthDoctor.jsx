  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { Link, useNavigate } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import { useSelector } from 'react-redux';
  const baseURL = "http://127.0.0.1:8000";

  const KYCAuthDoctor = () => {
    const [kycData, setKycData] = useState(null);
    const [error, setError] = useState(null);
  const [qualificationImage, setQualificationImage] = useState(null);
  const [licencecertificateImage, setCertificateImage] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [register_number, setRegister] = useState("");
  const [experience, setExperience] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const baseURL = "http://127.0.0.1:8000";

  const userId = useSelector(state => state.authentication_user.user_id);


  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        const response = await axios.get(`${baseURL}/auth/KycVerification-upload/${userId}/`);
        console.log(response,'rrrrrrrrrrrrrrrrrrrrreeeeeeeeeeeeeeeeeee');
        setQualificationImage(response.data.qualificationImage);
        setCertificateImage(response.data.licencecertificateImage);
        setAadhaarNumber(response.data.aadhaarNumber);
        setRegister(response.data.register_number);
        setExperience(response.data.experience);
    } catch (error) {
     console.log('no data');
      }
    };

    fetchKYCData();
 }, [userId]);






  const handleInputChange = (e) => {
      const { id, value, type, checked } = e.target;

      switch (id) {
        case "aadhaar":
          setAadhaarNumber(value);
          break;
        case "register_number":
          setRegister(value);
          break;
        case "experience":
          setExperience(value);
          break;
 
     
        default:
          break;
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!qualificationImage || !licencecertificateImage || !aadhaarNumber || !register_number ) {
        setError("Please fill in all fields.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("qualificationImage", qualificationImage);
        formData.append("licencecertificateImage", licencecertificateImage);
        formData.append("aadhaarNumber", aadhaarNumber);
        formData.append("register_number", register_number);
        formData.append("experience", String(experience));


        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }



        const authToken = localStorage.getItem('access');
        const response = await axios.post(`${baseURL}/auth/KycVerification-upload/${userId}/`, formData, {
          headers: {
              Authorization: `Bearer ${authToken}`,
              // 'Content-Type': 'multipart/form-data',
          },
      });
        

          if (response.data.status === "success") {
            toast.success("KYC completed Susssesfully")
            navigate("/doctor/DocHome");
          } else {
            setError(response.data.message || "KYC submission failed.");
          }
        } catch (error) {
          console.error("Error during KYC submission:", error);
          setError("An error occurred. Please try again later.");
        }
    };

  const nextStep = () => {
      setStep(step + 1);
  };

  const prevStep = () => {
      setStep(step - 1);
  };

  return (
  <div>
  
  <div className="bg-gray-100 min-h-screen flex justify-center items-center">
    
    <img
      src="/src/assets/logo/kyc2.jpg"
      width={600}
      height={100}
      alt="Step 1"
    />
    
    <div className="bg-gray-100 p-20 rounded-lg w-200">
      
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-4">KYC Authentication</h2>
          <p className="text-gray-600 mb-6">Doctor ID Verification</p>
          <div className="flex items-center mb-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={nextStep}>
              Start Verification
            </button>
          </div>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => console.log("Need help?")}
          >
            Need help?
          </button>
        </>
      )}
      
      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Verification Process</h2>
          <p className="text-gray-600 mb-6">
            Please provide the following information for verification:
          </p>

          <div className="grid w-full max-w-xs items-center gap-1.5">
            <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Doctor Certificate
            </label>
            <div className="flex items-center">
              <img src="/src/assets/logo/certificate_6703900.png" alt="Certificate" className="h-8 mr-4"/>
              <input className="flex w-full rounded-md border border-blue-300 border-input bg-white text-sm text-gray-400 file:border-0 file:bg-blue-600 file:text-white file:text-sm file:font-medium"
                type="file"
                id="picture"
                onChange={(e) => setCertificateImage(e.target.files ? e.target.files[0] : null)}
              />
            </div>
          </div>

          <div className="grid w-full max-w-xs items-center gap-1.5">
            <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Qualification
            </label>
            <div className="flex items-center">
              <img src="/src/assets/logo/label_5427739.png" alt="Qualification" className="h-8 mr-4"/>
              <input className="flex w-full rounded-md border border-blue-300 border-input bg-white text-sm text-gray-400 file:border-0 file:bg-blue-600 file:text-white file:text-sm file:font-medium"
                type="file"
                id="picture"
                onChange={(e) => setQualificationImage(e.target.files ? e.target.files[0] : null)}
              /> 
            </div>
          </div>

          <div className="flex items-center mb-6">
            <label htmlFor="aadhaar" className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Aadhaar Number:
            </label>
            <input
              type="text"
              id="aadhaar"
              className="border border-gray-300 p-2"
              value={aadhaarNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center mb-6">
            <label htmlFor="register_number" className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Register Number:
            </label>
            <input
              type="text"
              id="register_number"
              className="border border-gray-300 p-2"
              value={register_number}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center mb-6">
            <label htmlFor="experience" className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
           Experience
            </label>
            <input
              type="number"
              id="experience"
              className="ml-2"
              value={experience}
              onChange={handleInputChange}
            />
          </div>



     

          <div className="flex justify-between">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Verification Complete</h2>
          <p className="text-gray-600 mb-6">
            Your documents have been submitted for verification.
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => console.log("Continue")}
          >
            Continue
          </button>
        </>
      )}
      
    </div>
    
  </div>
  
</div>

 );
};

export default KYCAuthDoctor;
