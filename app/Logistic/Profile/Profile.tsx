'use client';

export const dynamic = 'force-dynamic';

import { getDisplayName } from 'next/dist/shared/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/authService'; // ✅ Import ฟังก์ชัน Logout


const Profile = () => {
    const [profileImage, setProfileImage] = useState("/images/ProfileDefault.jpg");
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("12345");
    const [role, setRole] = useState("Logistic");
    const [email, setEmail] = useState("user@gmail.com");
    const [phone, setPhone] = useState("+1234567890");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setProfileImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleEditClick = () => {
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
                        <label className="cursor-pointer bg-[#6C0E23] hover:bg-[#C98986] text-white py-2 px-4 rounded-full">
                            <input type="file" className="hidden" onChange={handleImageChange} />
                            Choose Profile Image
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-1/2">
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Username:</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{username}</p>
                            )}
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Password:</p>
                            <div className='flex gap-2 w-32'>
                                {isEditing ? (
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="text-lg text-left w-full border-b-2 border-gray-300 focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-lg text-left w-full">{showPassword ? password : "*****"}</p>
                                )}
                                <button onClick={() => setShowPassword(!showPassword)} className="text-sm text-gray-500">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                                                <path d="M3 13c3.6-8 14.4-8 18 0" />
                                                <path fill="currentColor" d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
                                            </g>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
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
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{phone}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-4 w-full mt-10'>
                    <button type="button" onClick={handleEditClick} className='bg-[#6C0E23] hover:bg-[#C98986] p-2 text-white rounded-full w-24 flex items-center justify-center gap-2'>
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
}

export default Profile;