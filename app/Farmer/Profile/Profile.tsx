
"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo, updateUserInfo } from "../../../services/authService";
import { logout } from '@/services/authService'; 




const Profile = () => {
    const [profileImage, setProfileImage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [role, setRole] = useState("Farmer");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const router = useRouter(); // <<< ตรงนี้ไม่มี!

    // ดึงข้อมูลฟาร์มและข้อมูลผู้ใช้เมื่อ component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo) {
                    setEmail(userInfo.email);
                    setFirstName(userInfo.firstName);
                    setLastName(userInfo.lastName);
                    setTelephone(userInfo.telephone);
                    setProfileImage(userInfo.profileImage || "/images/profile2.jpg"); // ✅ ใช้รูปจาก backend ถ้ามี
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);



    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setProfileImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = async () => {
        if (isEditing) {
            try {
                const success = await updateUserInfo(email, telephone, firstName, lastName, password, selectedFile);
                if (!success) {
                    alert("Failed to update user info.");
                    return;
                }
            } catch (error) {
                console.error("Error updating user info:", error);
                alert("Failed to update user info.");
                return;
            }
        }
        setIsEditing(!isEditing);
    };
    const handleSignOut = async () => {
           const success = await logout();
           if (success) {
               alert("Logout successful");
               router.push('/'); // กลับไปหน้า Login
           } else {
               alert("Failed to logout");
           }
       };


    return (
        <div className="flex flex-col items-center min-h-screen pt-24 px-10 p-10 bg-slate-100">
            <div className='flex flex-col items-center gap-4 bg-white w-3/4 border rounded-3xl p-10 shadow-xl '>
                <h1 className="text-5xl font-semibold">Your Profile</h1>
                <div className="flex justify-center w-full items-center gap-10 mt-10">
                    <div className="flex flex-col items-center gap-5 w-1/2">
                        <div className="flex justify-center items-center overflow-hidden w-56 h-56 rounded-full">
                            <img src={profileImage} alt="Profile Picture" className="flex justify-center items-center rounded-full" />
                        </div>
                        <label className="cursor-pointer bg-emerald-400 text-white py-2 px-4 rounded-full hover:bg-green-700">
                            <input type="file" className="hidden" onChange={handleImageChange} />
                            Choose Profile Image
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-1/2">
                    <div className="flex justify-between gap-6 w-full">
                        <p className="text-lg font-bold">Username:</p>
                        {isEditing ? (
                            <div className="flex flex-col gap-2 w-32">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="text-lg text-left border-b-2 border-gray-300 focus:outline-none"
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="text-lg text-left border-b-2 border-gray-300 focus:outline-none"
                                placeholder="Last Name"
                            />
                            </div>
                        ) : (
                            <p className="text-lg text-left w-32">{firstName} {lastName}</p>
                        )}
                        </div>

                        
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Role:</p>
                            <p className="text-lg text-left w-32">{role}</p>
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Email:</p>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{email}</p>
                            )}
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Phone:</p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{telephone}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-4 w-full mt-10'>
                    <button type="button" onClick={handleEditClick} className='bg-emerald-400 p-2 text-white rounded-full w-24 hover:bg-green-700 flex items-center justify-center gap-2'>
                        {isEditing ? "Save" : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
                                </svg>
                                Edit
                            </>
                        )}
                    </button>
                    <button type='button' onClick={handleSignOut} className='flex text-center border-2 rounded-full border-red-500 p-1 px-2 text-red-500 w-fit gap-2 hover:bg-red-500 hover:text-white'>
                        Sign out
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-7 w-7 inline' viewBox="0 0 24 24">
                            <g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M15.99 7.823a.75.75 0 0 1 1.061.021l3.49 3.637a.75.75 0 0 1 0 1.038l-3.49 3.637a.75.75 0 0 1-1.082-1.039l2.271-2.367h-6.967a.75.75 0 0 1 0-1.5h6.968l-2.272-2.367a.75.75 0 0 1 .022-1.06" /><path d="M3.25 4A.75.75 0 0 1 4 3.25h9.455a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0V4.75H4.75v14.5h7.954V17a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75.75H4a.75.75 0 0 1-.75-.75z" /></g>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Profile;
